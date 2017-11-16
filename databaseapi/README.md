# Database API #
This package aims to make your life easier when it comes to create an API based on MySql data.

## How to use ? ##
3 main objects are exposed here as follows.

### DatabaseObject ###
This is the basic object.
- It allows to ```query``` the database 
- It can create ```where``` strings from an array of fields and values

### DatabaseRecordset ###
Inheritates from ```DatabaseObject``` and provides access to any database recordset

### DatabaseTable ###
Inheritates from ```DatabaseRecordset``` and provides access to crud functions + list of fields (fresh record)

## Dependencies ##

- bdt105toolbox
- bdt105connexion