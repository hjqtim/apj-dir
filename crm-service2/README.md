# CRM Service

1 构建镜像
docker build -t crm-core-svc .

2 运行
docker run -dit \
    --restart=always \
    --name crm-core-svc
    -e "JAVA_OPTS=-Xmx768M -Xms768M -Xmn256M -Xss256K" \
    -e "spring.profiles.active=dev" \
    -e "spring.datasource.url=jdbc:p6spy:mysql://dbsvmc1c:10016/crm_service?serverTimezone=Asia/Shanghai&zeroDateTimeBehavior=convertToNull&useSSL=false&autoReconnect=true&tinyInt1isBit=false&useUnicode=true&characterEncoding=utf8&allowMultiQueries=true" \
    -e "spring.datasource.username=sc1adm" \
    -e "spring.datasource.password=APJ@'!QAZ2wsx'" \
    -e "camunda.url=localhost:8081" \
    -e "camunda.name=demo" \
    -e "fileService.url=http://localhost:8083" \
    -e "aaaService.url=http://localhost:xxx" \
    -p 8080:8080 \
    crm-core-svc

