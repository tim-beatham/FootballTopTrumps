package database;

import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import com.mongodb.MongoClientOptions;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.codecs.pojo.PojoCodecProvider;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.MongoTemplate;
import webserver.generatedata.Players;
import webserver.model.Player;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import static org.bson.codecs.configuration.CodecRegistries.fromProviders;
import static org.bson.codecs.configuration.CodecRegistries.fromRegistries;

public class InsertPlayersToDB {

    public static void insertPlayersToDB() throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        // Read all the players into the players json file.
        Players players = objectMapper.readValue(new File("players.json"), Players.class);

        // Create a codec
        CodecRegistry pojoCodec = fromRegistries(MongoClient.getDefaultCodecRegistry(), fromProviders(PojoCodecProvider
        .builder().automatic(true).build()));


        MongoClient mongoClient = new MongoClient("localhost",
                MongoClientOptions.builder().codecRegistry(pojoCodec).build());
        MongoDatabase db = mongoClient.getDatabase("FootballCardGame");

        MongoCollection<Player> playersCollection = db.getCollection("players", Player.class);
        List<Player> playersList = new ArrayList<>(players.getPlayerList());

        // Delete all documents first of all (meaning we can update documents).
        BasicDBObject document = new BasicDBObject();
        playersCollection.deleteMany(document);

        playersCollection.insertMany(playersList);
    }

    public static void main(String[] args) throws IOException {
        insertPlayersToDB();
    }


}
