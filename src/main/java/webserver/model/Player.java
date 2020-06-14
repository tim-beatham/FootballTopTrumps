package webserver.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.util.Objects;

/**
 * Represents a player.
 * @author timbeatham
 */

public class Player {

    private String name;
    private String team;
    private String birthDate;
    private String position;
    private int goals;
    private int assists;
    private int yellowCards;
    private int redCards;
    private int minsPlayed;
    private int starts;
    private String imageURL;
    private String division;

    public Player() {}

    /**
     * Represents a Player (POJO)
     * @param name of the player
     * @param team the player is a part of
     * @param birthDate of the player
     * @param position the player plays in
     * @param goals the number of goals the player has
     * @param assists the number of assists the player has
     * @param yellowCards the number of yellow cards the player has
     * @param redCards the number of red cards the player has
     * @param minsPlayed the number of minutes played the player has played this season
     * @param starts total number of starts the player has in the current season
     * @param imageURL location of the players image icon on the internet
     * @param division division the player plays in.
     */
    public Player(String name, String team, String birthDate, String position, int goals,
                  int assists, int yellowCards, int redCards, int minsPlayed, int starts,
                  String imageURL, String division) {
        this.name = name;
        this.team = team;
        this.birthDate = birthDate;
        this.position = position;
        this.goals = goals;
        this.assists = assists;
        this.yellowCards = yellowCards;
        this.redCards = redCards;
        this.minsPlayed = minsPlayed;
        this.starts = starts;
        this.imageURL = imageURL;
        this.division = division;
    }

    public int getStarts() {
        return starts;
    }

    public void setStarts(int starts) {
        this.starts = starts;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTeam() {
        return team;
    }

    public void setTeam(String team) {
        this.team = team;
    }


    public String getPosition() {
        return position;
    }

    public String getImageURL() {
        return imageURL;
    }

    public void setImageURL(String imageURL) {
        this.imageURL = imageURL;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public int getGoals() {
        return goals;
    }

    public void setGoals(int goals) {
        this.goals = goals;
    }

    public int getAssists() {
        return assists;
    }

    public void setAssists(int assists) {
        this.assists = assists;
    }

    public int getYellowCards() {
        return yellowCards;
    }

    public void setYellowCards(int yellowCards) {
        this.yellowCards = yellowCards;
    }

    public int getRedCards() {
        return redCards;
    }

    public void setRedCards(int redCards) {
        this.redCards = redCards;
    }

    public int getMinsPlayed() {
        return minsPlayed;
    }

    public void setMinsPlayed(int minsPlayed) {
        this.minsPlayed = minsPlayed;
    }


    public String getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(String birthDate) {
        this.birthDate = birthDate;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Player player = (Player) o;
        return goals == player.goals &&
                assists == player.assists &&
                yellowCards == player.yellowCards &&
                redCards == player.redCards &&
                minsPlayed == player.minsPlayed &&
                starts == player.starts &&
                Objects.equals(name, player.name) &&
                Objects.equals(team, player.team) &&
                Objects.equals(birthDate, player.birthDate) &&
                Objects.equals(position, player.position) &&
                Objects.equals(imageURL, player.imageURL) &&
                Objects.equals(division, player.division);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, team, birthDate, position, goals, assists,
                yellowCards, redCards, minsPlayed, starts, imageURL, division);
    }

    @Override
    public String toString() {
        return "Player{" +
                "name='" + name + '\'' +
                ", team='" + team + '\'' +
                ", birthDate='" + birthDate + '\'' +
                ", position='" + position + '\'' +
                ", goals=" + goals +
                ", assists=" + assists +
                ", yellowCards=" + yellowCards +
                ", redCards=" + redCards +
                ", minsPlayed=" + minsPlayed +
                ", starts=" + starts +
                ", imageURL='" + imageURL + '\'' +
                ", division='" + division + '\'' +
                '}';
    }

    public String getDivision() {
        return division;
    }

    public void setDivision(String division) {
        this.division = division;
    }
}
