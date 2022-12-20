#!/bin/bash
#
# Script for starting your Java App in PaaS / Docker environment
# Modified from the SC4 Nico's version. 
#
# Environments variables supported:
# 1. JAR_FILE - mandatory, the path to your application JAR file
# 2. JVM_MEM_ARGS - optional, JVM memory related agruments, e.g. Xmx/Xms. If not supply, will set Xmx=Xms=1/2 of allocated memory
# 3. JVM_ARGS - optional, custom non-memory related JVM arguments
# 4. PROGRAM_ARGS - optional, the argument pass to your application (e.g. for the main method)  
# 5. BASE_LOG_DIR - optional, the folder for logging. This path should be SAME as the ALS log path. 
# 6. ELASTIC_APM_JAR_FILE, ELASTIC_APM_SERVER_URLS - optional, path to the Elastic APM JAR file and URL to the APM servers"
# 7. SCRIPT_DEBUG - optional, set to "true" to print debug message for this script
# 8. GC_LOG - optional, set to "true" to enable GC log. Will keep max. 5 GC log, each of size 10M. The GC log will be put in the LOG Folder
# 9. DEFAULT_TRUSTSTORE - optional, by default is true. Set this value to false if you don't want to to use the default SSL store setting
# Notice:
# 1. If you run this script in a window docker host, you MUST specify the memory and CPU argument. Otherwise, the memory/CPU detection command will not works 
#    e.g. allocate 1 CPU and 1GB memory> docker --memory="1g" --cpus="1"
#
#
# ---------------------------------------------------------------------------------------------------------------------

# ---------------------------------------------------------------------------------------------------------------------
# Debug the script or not. If there is something abnormal, you can turn on this env to see debug trace of this .sh
# ---------------------------------------------------------------------------------------------------------------------
if [ "${SCRIPT_DEBUG}" = "true" ]; then	
	set -x
fi

# ---------------------------------------------------------------------------------------------------------------------
# check mandatory input 
# ---------------------------------------------------------------------------------------------------------------------

if [ -z $JAR_FILE ]; then

	echo "Please supply the following environment variables:"
	echo "--------------------------------------------------------------------------------------------------------------------------------"
	echo "1. JAR_FILE - mandatory, the path to your application JAR file"
	echo "2. JVM_MEM_ARGS - optional, JVM memory related agruments, e.g. Xmx/Xms. If not supply, will set Xmx=Xms=1/2 of allocated memory"
	echo "3. JVM_ARGS - optional, non-memory related JVM arguments"
	echo "4. PROGRAM_ARGS - optional, the argument pass to your application (e.g. for the main method)"
	echo "5. BASE_LOG_DIR - optional, the folder for logging. This path should be SAME as the ALS log path. "
	echo "6. ELASTIC_APM_JAR_FILE, ELASTIC_APM_SERVER_URLS - optional, path to the Elastic APM JAR file and URL to the APM servers"
	echo "7. SCRIPT_DEBUG - optional, set to 'true' to print debug message for this script"
	echo "8. GC_LOG - optional, set to 'true' to enable GC log. Will keep max. 5 GC log, each wich size 10M"
	echo "9. DEFAULT_TRUSTSTORE - optional, by default is true. Set this value to false if you don't want to to use the default SSL store setting"
	echo "--------------------------------------------------------------------------------------------------------------------------------"
	echo "If you run this script in docker environment with Winddows host, you need to specify docker arguments for memory and CPU, e.g. --memory='1g' --cpus='1'. Otherwise, the CPU and memory detection will be failed." 
	
	exit -1  

fi

# ---------------------------------------------------------------------------------------------------------------------
# Logging directory setup (for CLAP and others logging)
# ---------------------------------------------------------------------------------------------------------------------

# set the default base log dir to '/logs'
if [ -z $BASE_LOG_DIR ]; then

	# export BASE_LOG_DIR=/logs
	export BASE_LOG_DIR=/tmp

fi

# check the hostname. in OpenShift, there will be a ENV 'HOSTNAME' set to the name of the POD.
if [ -z $HOSTNAME ]; then

	export HOSTNAME=`uname -n`

fi

# set the full path for logging
export LOG_DIR=${BASE_LOG_DIR}/${HOSTNAME}
echo "------------------------------------------------------------"
echo "Logging directory set to:" $LOG_DIR

# create log file directory if not exists
if [ ! -d $LOG_DIR ]; then
   mkdir -p $LOG_DIR
   
   if [ $? -ne 0 ]; then 
   
       echo "Cannot create log dir: " $LOG_DIR
       
       exit -2
   
   fi
   
   echo "Create log directory: " $LOG_DIR
fi

# ---------------------------------------------------------------------------------------------------------------------
# JVM memory setup
# ---------------------------------------------------------------------------------------------------------------------

# Find the total memory allocated to the container in MB.
# If you need to customize the java heap size, you need to find the memory allocated 

MemByte=`cat /sys/fs/cgroup/memory/memory.limit_in_bytes`
MemMB=$[MemByte/1024/1024]

echo "------------------------------------------------------------"
echo "Memory allocated to container: " ${MemMB}MB 

# set the default memory setting if no memory JVM argument specified
# ref: https://docs.oracle.com/javase/8/docs/technotes/guides/vm/gctuning/parallel.html#default_heap_size

if [ -z $JVM_MEM_ARGS ]; then

	# set the default heap size = 1/2 of total memory allocated to the container
	# and set the initial heap size = max heap size to avoid heap resizing
	XMX=$[MemMB/2]
	XMS=$XMX
		
	export JVM_MEM_ARGS="-Xmx${XMX}m -Xms${XMS}m" 
	
	echo "------------------------------------------------------------"
	echo "Use default JVM memory setting: " $JVM_MEM_ARGS

	# Specify the NewRatio if you need to tune the old/young generation size. Default young generation = 1/3 of heap size 
	# ref: https://docs.oracle.com/javase/8/docs/technotes/guides/vm/gctuning/sizing.html
	#JVM_MEM_ARGS=$JVM_MEM_ARGS -XX:NewRatio=3

	# Specify the Metaspace (aka to PermGen Space of JDK7 or earlier)
	#JVM_MEM_ARGS=$JVM_MEM_ARGS XX:MaxMetaspaceSize=96m 

fi

# ---------------------------------------------------------------------------------------------------------------------
# JVM no of CPU checking. Can you uncomment script to find the CPU allocated to the container. You can tune the thread 
# count (e.g. GC thread) if needed based on this value
# ---------------------------------------------------------------------------------------------------------------------
#cpu_quota=`cat /sys/fs/cgroup/cpu/cpu.cfs_quota_us`
#cpu_period=`cat /sys/fs/cgroup/cpu/cpu.cfs_period_us`
#cpu=$[cpu_quota/cpu_period]


# ---------------------------------------------------------------------------------------------------------------------
# Enable JVM GC logging or not. If enabled, the log is put in the 
# ---------------------------------------------------------------------------------------------------------------------
if [ "${GC_LOG}" = "true" ]; then
	
	export JVM_GC="-verbose:gc -Xloggc:${LOG_DIR}/${HOSTNAME}.gc.%t.log -XX:+UseGCLogFileRotation -XX:NumberOfGCLogFiles=5 -XX:GCLogFileSize=10M -XX:+PrintGCDetails -XX:+PrintGCTimeStamps -XX:+PrintGCDateStamps -XX:+PrintGCCause"
	echo "------------------------------------------------------------"
	echo "GC Log enabled. GC log file at: " ${LOG_DIR}/${HOSTNAME}.gc.%t.log
fi

# ---------------------------------------------------------------------------------------------------------------------
# Setup Java keystore for SSL connection
# ---------------------------------------------------------------------------------------------------------------------
if [ ! "${DEFAULT_TRUSTSTORE}" = "false" ]; then
	
	export JVM_TRUSTSTORE="-Djavax.net.ssl.trustStore=/home/jboss/cacerts -Djavax.net.ssl.trustStorePassword=changeit"
	echo "------------------------------------------------------------"
	echo "SSL truststore setting: " $JVM_TRUSTSTORE
	
fi


# ---------------------------------------------------------------------------------------------------------------------
# Setup tomcat HTTP access log for CLAP. Make sure you adhere to the format specified for CLAP log ingestion
# 1. JSON format
# 2. filename = ${HOSTNAME}-access-json.log.yyyyMMdd
# ---------------------------------------------------------------------------------------------------------------------

export TOMCAT_HTTP_LOGGING="-Dserver.tomcat.accesslog.encoding=UTF-8 -Dserver.tomcat.accesslog.prefix=${HOSTNAME} -Dserver.tomcat.accesslog.file-date-format=-yyyyMMdd -Dserver.tomcat.accesslog.suffix=-access-json.log -Dserver.tomcat.accesslog.directory=$LOG_DIR -Dserver.tomcat.accesslog.enabled=true -Dserver.tomcat.accesslog.pattern={\"x_forwarded_for\":\"%{X-Forwarded-For}i\",\"client_ip\":\"%h\",\"client_user\":\"%l\",\"authenticated\":\"%u\",\"request_time\":\"%{yyyy-MM-dd'T'HH:mm:ss.SSSZ}t\",\"request_url\":\"%r\",\"http_code\":\"%s\",\"send_bytes\":\"%b\",\"query_string\":\"%q\",\"http_referer\":\"%{Referer}i\",\"user_agent\":\"%{User-Agent}i\",\"request_time_ms\":\"%D\"}"

echo "------------------------------------------------------------"
echo "Tomcat HTTP access log dir: " $LOG_DIR 

# ---------------------------------------------------------------------------------------------------------------------
# Setup Elastic APM 
# ---------------------------------------------------------------------------------------------------------------------

if [ ! -z $ELASTIC_APM_JAR_FILE ]; then

	export ELASTIC_APM_SETTING="-javaagent:${ELASTIC_APM_JAR_FILE} -Delastic.apm.service_name=$HOSTNAME -Delastic.apm.environment=embedded_tomcat -Delastic.apm.log_file=${LOG_DIR}/${HOSTNAME}-elasticapm.log -Delastic.apm.log_level=INFO -Delastic.apm.transaction_sample_rate=1.0"
	echo "------------------------------------------------------------"
	echo "Enable APM. "
	echo "APM JAR file location: " ${ELASTIC_APM_JAR_FILE}
	echo "APM Server URL: " $ELASTIC_APM_SERVER_URLS
	echo "APM Log file: " ${LOG_DIR}/${HOSTNAME}-elasticapm.log
fi

# ---------------------------------------------------------------------------------------------------------------------
# Setup default file mask
# ---------------------------------------------------------------------------------------------------------------------

export UMASK=0022

echo "------------------------------------------------------------"
echo "Set file UMASK: $UMASK"

# ---------------------------------------------------------------------------------------------------------------------
# Finally, setup the full JVM argument to start your application
# ---------------------------------------------------------------------------------------------------------------------

echo "------------------------------------------------------------"
echo ""
echo "Application JAR file: " $JAR_FILE
echo ""
echo "Program argument: " $PROGRAM_ARGS


export JAVA_OPTS="-server $ELASTIC_APM_SETTING $JVM_MEM_ARGS $JVM_GC \
-XX:+HeapDumpOnOutOfMemoryError \
-XX:HeapDumpPath=$LOG_DIR \
-Djava.awt.headless=true \
-Djava.security.egd=file:/dev/./urandom \
-Dfile.encoding=UTF-8  \
$JVM_TRUSTSTORE $JVM_ARGS $TOMCAT_HTTP_LOGGING"

export JDK_JAVA_OPTIONS="${JAVA_OPTS}"

echo "------------------------------------------------------------"
echo "JVM options used:"
echo "------------------------------------------------------------"

for arg in $JAVA_OPTS
do
    echo ">> " $arg
done
echo "------------------------------------------------------------"

# ---------------------------------------------------------------------------------------------------------------------
# start the program (make sure to use exec to start it for using PID = 1 so that java can receive signal
# ---------------------------------------------------------------------------------------------------------------------
exec java $JAVA_OPTS -jar $JAR_FILE $PROGRAM_ARGS

exit $?
