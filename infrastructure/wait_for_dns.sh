dns_name=$1
dig_output=""

echo "Waiting for DNS record $dns_name"
while [[ $dig_output == "" ]]
do
    dig_output=$(dig @1.1.1.1 $dns_name | grep "ANSWER SECTION")
    echo "No record yet..."
    sleep 10
done
echo "Record found"