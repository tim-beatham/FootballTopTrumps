package webserver.assembler;

import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.stereotype.Component;
import webserver.controllers.ChampionshipController;
import webserver.model.Player;

@Component
public class ChampionshipAssembler implements RepresentationModelAssembler<Player, EntityModel<Player>> {
    @Override
    public EntityModel<Player> toModel(Player player) {

        return EntityModel.of(player,
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(ChampionshipController.class).one(player.getId()))
        .withSelfRel(),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(ChampionshipController.class).all())
        .withRel("championship"));

    }
}
