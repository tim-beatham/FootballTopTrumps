package webserver.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import webserver.model.Player;

@Repository
public interface ChampionshipRepository extends JpaRepository<Player, Long> {}
