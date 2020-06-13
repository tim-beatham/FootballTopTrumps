package webserver.controllers;

import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import webserver.assembler.ChampionshipAssembler;
import webserver.exceptions.PlayerNotFoundException;
import webserver.model.Player;
import webserver.repository.ChampionshipRepository;

import javax.swing.text.html.parser.Entity;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@RestController
public class ChampionshipController {

    private final ChampionshipRepository repository;

    private final ChampionshipAssembler assembler;

    public ChampionshipController(ChampionshipRepository repository, ChampionshipAssembler assembler) {
        this.repository = repository;
        this.assembler = assembler;
    }

    @GetMapping("/championship/{id}")
    public EntityModel<Player> one(@PathVariable Long id) {
        Player player = repository.findById(id)
                .orElseThrow(() -> new PlayerNotFoundException(id));

        return assembler.toModel(player);
    }

    @GetMapping("/championship")
    public CollectionModel<EntityModel<Player>> all() {
        List<EntityModel<Player>> players = repository.findAll().stream()
                .map(player -> EntityModel.of(player,
                        WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(ChampionshipController.class)
                        .one(player.getId())).withSelfRel(),
                        WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(ChampionshipController.class).all())
                .withRel("employees")))
                .collect(Collectors.toList());

        return CollectionModel.of(players,
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(ChampionshipController.class).all())
        .withSelfRel());
    }
}

