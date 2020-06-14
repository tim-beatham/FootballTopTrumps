package webserver.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import webserver.model.Player;

import java.util.List;

public class PlayerRepositoryImpl implements PlayerRepositoryCustom{

    private final MongoTemplate mongoTemplate;

    @Autowired
    public PlayerRepositoryImpl(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }


    @Override
    public List<Player> playerQuery(String attribute, char operator, Object value) {
        Query query = new Query();
        switch (operator) {
            case '<':
                query.addCriteria(Criteria.where(attribute).lt(value));
                break;
            case '=':
                query.addCriteria(Criteria.where(attribute).is(value));
                break;
            case '>':
                query.addCriteria(Criteria.where(attribute).gt(value));
                break;
        }
        return mongoTemplate.find(query, Player.class);
    }
}
