##The Inspiration

As a stingy college student who wants to get better at cooking, the local grocery 
stores in Charlottesville are pretty important in my daily life. However, it's 
not always easy to know where to shop if I want the best deals. I've done my fair
share of shopping, but not everyone wants to spend so many trips visiting each and every 
store in the area to derive their own optimal grocery list -- what a waste of time,
gas, and patience!

##The Project

For myself and my friends who had the same concerns, I decided to use this as an
opportunity to grow as a full-stack developer and build this grocery list optimizing
service! It works like a miniature search engine that fields user input through text and 
store filters and returns a list of the lowest prices for any item the user searches for.
The user may search either one single item and see a list of the five lowest prices in the 
area, or enter a list of items separated by commas to see a completely optimal shopping trip
thoroughly planned out and sorted by store!

![system_full](https://github.com/benlchang/grocery_cville/assets/86611416/73fba2f0-d859-4036-84cf-2245aac73cb1)\
_Full system design for the grocery list optimizer project. Backend technologies like web scraping scripts and Kroger API programs not included._

##The Architecture

I designed and built the user interface with React, a framework I've come to love for its 
straightforward component architecture and state management. At the click of a button, the 
user's search filters get sent to a REST API I built with an Express.js backend server, which then
fetches data from a PostgreSQL database that I populated with grocery store data via Kroger's 
very own products API and some web scraping of a live user-made Trader Joe's inventory site. The backend
uses Google's Universal Sentence Encoder to perform cosine similarity to compare the user's search with
the products in the database, ensuring that the user can find the closest items to what they want every time.
