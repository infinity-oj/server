docker build -t ccr.ccs.tencentyun.com/sustech-cloud/oj-server:$1 -f ./dockerfile .
docker push ccr.ccs.tencentyun.com/sustech-cloud/oj-server:$1