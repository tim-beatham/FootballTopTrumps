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


public class ChampionshipController {


}

