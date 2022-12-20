# FROM docker-registry.default.svc:5000/openshift/ha-redhat-openjdk18-openshift:1.8-7.1594897657
FROM artifactrepo:55743/int_docker_dev/projects/ocp_app_image/it_support/redhat-openjdk-18/openjdk18-openshift:1.11-1.1648472891

#set the timezone to HK
ENV TZ=Asia/Hong_Kong

#set the working dir
WORKDIR /

#copy sample app jar. the environment variable JAR_FILE needs to point to this location  
COPY ./target/crm-core-svc-0.0.3.jar /

#environment variable to the application JAR file which is required for the start.sh
ENV JAR_FILE=/crm-core-svc-0.0.3.jar

# copy the starting script file
COPY ./deploy/start.sh /

ENTRYPOINT ["/bin/bash", "start.sh"]

#expose the port, which should corresponding to the server.port in application.properties 
EXPOSE 8080
