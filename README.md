# FootballTopTrumps

In Week 5 of my Programming Projects blog I developed a top trumps application.
To view this blog post please visit: https://tim-beatham.github.io/Week5/Week5.html

I implemented Top Trumps using a Spring Boot backend and a React-Native front end. Top Trumps is a british card game in which 2 or more players take turn to choose an attribute that trumps all other attributes in other peoples cards. The person with the highest attribute takes all the card for that round. The last person standing is the winner.

## Web Scraping

To get all the data about players I scraped the data from [FBREF](https://fbref.com). I used regular expressions so that I can scrape data from any league on the site.

![the fbref website](https://tim-beatham.github.io/Week5/fbref.png)

## The Back End

I used Spring Boot and MongoDB to develop the backend of the application. I chose to use MongoDB as it is a NoSQL database store. This means I am not limited to a rigid schema. This allows my cards to potentially have special attributes and it also means that newer cards are compatible with older cards.

Below are the PoJo designs for the backend:

![pojos for the backend](https://tim-beatham.github.io/Week5/Football_PoJos.png)

I developed a REST API so the front end can query player cards, query decks and add decks to the MongoDB database.

## The Front End

![ui design for the app](https://tim-beatham.github.io/Week5/app_design.png)

Above shows an incredibly basic design for the UI. As shown the app allows the user to create new decks, view decks, create and join games.

![final ui for the app](https://tim-beatham.github.io/Week5/final_app.png)

The app ending up looking like this. The point of the app is to replace the paper based top trumps decks and also allow users to  customize decks further. The users still need to be next to each other to play the game as they the users define the results for trumping another card. Therefore a player clicks I won if they trumped all the other players. Of course a user could just spam I won but this obviously makes the game boring.
