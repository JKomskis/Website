dns_name=$1
dig_output=""

echo "Waiting for DNS record $dns_name"
while [[ $dig_output == "" ]]
do
    dig_output=$(dig $dns_name | grep "CNAME")
    echo "No record yet..."
    sleep 10
done
echo "CNAME record found"