public class Player {

    private String name;
    private String team;
    private int age;
    private String position;
    private int goals;
    private int assists;
    private int yellowCards;
    private int redCards;
    private int tackles;
    private int minsPlayed;
    private int starts;
    private String imageURL;

    /**
     * Represents a Player from the WhoScored website.
     * @param name of the player
     * @param team the player is a part of
     * @param age of the player
     * @param position the player plays in
     * @param goals the number of goals the player has
     * @param assists the number of assists the player has
     * @param yellowCards the number of yellow cards the player has
     * @param redCards the number of red cards the player has
     * @param tackles the number of tackles the player averages in a game
     * @param minsPlayed the number of minutes played the player has played this season
     * @param starts total number of starts the player has in the current season
     * @param imageURL location of the players image icon on the internet
     */
    public Player(String name, String team, int age, String position, int goals,
                  int assists, int yellowCards, int redCards, int tackles, int minsPlayed, int starts,
                  String imageURL) {
        this.name = name;
        this.team = team;
        this.age = age;
        this.position = position;
        this.goals = goals;
        this.assists = assists;
        this.yellowCards = yellowCards;
        this.redCards = redCards;
        this.tackles = tackles;
        this.minsPlayed = minsPlayed;
        this.starts = starts;
        this.imageURL = imageURL;
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

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
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

    public int getTackles() {
        return tackles;
    }

    public void setTackles(int tackles) {
        this.tackles = tackles;
    }

    public int getMinsPlayed() {
        return minsPlayed;
    }

    public void setMinsPlayed(int minsPlayed) {
        this.minsPlayed = minsPlayed;
    }

    @Override
    public String toString() {
        return "Player{" +
                "name='" + name + '\'' +
                ", team='" + team + '\'' +
                ", age=" + age +
                ", position='" + position + '\'' +
                ", goals=" + goals +
                ", assists=" + assists +
                ", yellowCards=" + yellowCards +
                ", redCards=" + redCards +
                ", tackles=" + tackles +
                ", minsPlayed=" + minsPlayed +
                ", starts=" + starts +
                '}';
    }
}