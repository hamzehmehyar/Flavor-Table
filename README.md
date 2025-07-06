# Flavor-Table

- deployment 

https://flavor-table-1.onrender.com/

try this iser to login

username : meho
password : 123456

- this website is representing 4 pages which are the flacor table that represents the flavors ,

and a favorites page where you can add and remove your favorites recipes , and a random recipe page where you can 

generate a random recipe by clicking , and a search page where you can search for a specific recipes and 

add them to the favorites page


this website is working on 4567 port , and if you want you can navigate between pages through a navigation

bar , there is also several routes for pages where you can enter them to easily access this pages 

- this will be the default page as the home page which contains the flavor table 

         http://localhost:4567/              

- http://localhost:4567/generaterandomrecipe

- http://localhost:4567/search

- http://localhost:4567/favorites

note: to start the database you have to make the following steps 

sqlstart

- then type

psql flavor_table

- then type 

SELECT * FROM recipes

to see the database saving the recipes when you click save