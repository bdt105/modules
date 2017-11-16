# Toolbox #
This package gives functions to use and reuse anywhere.

## How to use ? ##
Create an object Toolbox 
~~~
import { Toolbox } from "bdt105toolbox/dist";

let t = new Toolbox();

~~~
## Functions ##

### dateToDbString(date: Date) ###
Formats a date usable by MySql, format: "yyyy-MM-dd HH:mm:ss"

### isoDateToDbString(date: Date) ###
Transforms an iso date into MySql format: "yyyy-MM-ddTHH:mm:ss" => "yyyy-MM-dd HH:mm:ss"

### CSVtoArray (text: string) : string[] ###
Transforms into an array a csv line. Separator is ";"

### arrayToCSV(array: string[], separator = ";"): string ###
Transforms into a csv string an array.

### Levenshtein (a: string, b: string): number ###
Calculate Levenshtein distance between two strings.

### arrayOfObjectsToString (array: any, fieldName: string, value: string, separator: string, prefix: string, suffix: string) ###
Transforms an array of objects into a string. Mainly used to create sql where strings.
~~~
arrayOfObjectsToString([
    {"fieldName": "firstName"}, 
    {"fieldName": "lastName"}, 
    {"fieldName": "email"}], "fieldName", "value", "AND", "like '%", "%'")
~~~
becomes
~~~
firstName like '%value%' AND lastName like '%value%' AND email like '%value'
~~~

### urlParamsToObject(url: string) ###
Transforms the params of an url into an object.
~~~
http://www.url.com?param1=1&param2=2&param3=3
~~~
becomes
~~~
{"param1": 1, "param2": 2, "param3": 3}
~~~

### urlBase(url: string) ###
Gets the base of an url.
~~~
http://www.url.com?param1=1&param2=2&param3=3
~~~
becomes
~~~
http://www.url.com
~~~

### filterArrayOfObjects(array: any[], keySearch: string, keyValue: string) ###
Retreives the entries of an array of objects matching the filter keySearch == keyValue.

### findIndexArrayOfObjects(array: any[], keySearch: string, keyValue: string) ###
Retreives the index of an array of objects matching the filter keySearch == keyValue. First value found is retreived.

### factorizeMasterSlave(data: any, masterIdFieldName: string, slaveIdFieldName: string, slaveName: string) ###
For a flat object will create a master slave object.
~~~
factorizeMasterSlave(
[
    {"customerId": 1, "customerName": "customerName1", "orderId": 11, "orderDescription": "order11"}, 
    {"customerId": 1, "customerName": "customerName1", "orderId": 12, "orderDescription": "order12"}, 
    {"customerId": 1, "customerName": "customerName1", "orderId": 13, "orderDescription": "order13"},
    {"customerId": 2, "customerName": "customerName2", "orderId": 21, "orderDescription": "order21"}, 
    {"customerId": 2, "customerName": "customerName2", "orderId": 22, "orderDescription": "order22"}, 
    {"customerId": 2, "customerName": "customerName2", "orderId": 23, "orderDescription": "order23"}
], "customerId", "orderId", "orders");
~~~
becomes
~~~
[
    {"customerId": 1, "customerName": "customerName1", 
        "orders": [
            {"orderId": 11, "orderDescription": "order11"}
            {"orderId": 12, "orderDescription": "order12"}
            {"orderId": 13, "orderDescription": "order13"}
        ]
    },
    {"customerId": 2, "customerName": "customerName2", 
        "orders": [
            {"orderId": 21, "orderDescription": "order21"}
            {"orderId": 22, "orderDescription": "order22"}
            {"orderId": 23, "orderDescription": "order23"}
        ]
    }
]
~~~

### isoDateToDbString(date: Date) ###
Transforms an iso date into MySql format: "yyyy-MM-ddTHH:mm:ss" => "yyyy-MM-dd HH:mm:ss"

### isoDateToDbString(date: Date) ###
Transforms an iso date into MySql format: "yyyy-MM-ddTHH:mm:ss" => "yyyy-MM-dd HH:mm:ss"

### isoDateToDbString(date: Date) ###
Transforms an iso date into MySql format: "yyyy-MM-ddTHH:mm:ss" => "yyyy-MM-dd HH:mm:ss"

