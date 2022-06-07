dns_name=$1
dig_output=""

echo "Waiting for DNS record $dns_name"
while [[ $dig_output == "" ]]
do
    dig_output=$(dig @1.1.1.1 $dns_name | grep "ANSWER SECTION")
    echo "No record yet..."
    echo `dig @1.1.1.1 $dns_name`
    sleep 30
done
echo "Record found"