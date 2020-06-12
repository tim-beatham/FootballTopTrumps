public class Player {

    private String name;
    private String team;
    private int age;
    private int weight;
    private int height;
    private String position;
    private int goals;
    private int assists;
    private int yellowCards;
    private int redCards;
    private int manOfTheMatches;
    private int tackles;
    private int minsPlayed;

    /**
     * Represents a Player from the WhoScored website.
     * @param name of the player
     * @param team the player is apart of
     * @param age of the player
     * @param weight of the player
     * @param height of the player
     * @param position the player plays in
     * @param goals the number of goals the player has
     * @param assists the number of assists the player has
     * @param yellowCards the number of yellow cards the player has
     * @param redCards the number of red cards the player has
     * @param manOfTheMatches the number of man of the matches the player has accumulated.
     * @param tackles the number of tackles the player averages in a game
     * @param minsPlayed the number of minutes played the player has played this season
     */
    public Player(String name, String team, int age, int weight, int height, String position, int goals,
                  int assists, int yellowCards, int redCards, int manOfTheMatches, int tackles, int minsPlayed) {
        this.name = name;
        this.team = team;
        this.age = age;
        this.weight = weight;
        this.height = height;
        this.position = position;
        this.goals = goals;
        this.assists = assists;
        this.yellowCards = yellowCards;
        this.redCards = redCards;
        this.manOfTheMatches = manOfTheMatches;
        this.tackles = tackles;
        this.minsPlayed = minsPlayed;
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

    public int getWeight() {
        return weight;
    }

    public void setWeight(int weight) {
        this.weight = weight;
    }

    public int getHeight() {
        return height;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public String getPosition() {
        return position;
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

    public int getManOfTheMatches() {
        return manOfTheMatches;
    }

    public void setManOfTheMatches(int manOfTheMatches) {
        this.manOfTheMatches = manOfTheMatches;
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
}
