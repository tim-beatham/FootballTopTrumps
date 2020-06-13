package webserver.exceptions;

public class PlayerNotFoundException extends RuntimeException{
    public PlayerNotFoundException(Long id) {
        super("The player with " + id + " was not found");
    }
}
