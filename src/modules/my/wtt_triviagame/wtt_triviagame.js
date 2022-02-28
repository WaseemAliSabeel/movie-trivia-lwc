import { LightningElement,track  } from 'lwc';

// Waseem's IMDb Top 250 Data hardcoded JSON file for initial load
import IMDB250Data from '../../../../IMDB250Data.json';


export default class Wtt_triviagame extends LightningElement {

    @track allData = [];
    @track randomData;
    @track showHints = false;
    @track showAnswer = false;
    @track ATeamPoints = 0;
    @track BTeamPoints = 0;
    @track ATeamMembers='';
    @track BTeamMembers='';
    @track ATeamName = 'Team A';
    @track BTeamName = 'Team B';
    @track currentPoints = 0;
    @track gameOver = false;
    @track displayedSet = [];
    @track disableA = false;
    @track disableB = false;
    teamsReady = true;
    darkmode = true;

    
    
    /************** Lifecycle Hook Method called on load of the LWC **************/
    connectedCallback(){
        this.allData = IMDB250Data.imdb_movies;
        this.displayedSet = [];
        this.checkmode();
        this.randomize();
        console.clear();
    }

    /************** Method to bind values to A Team Members text area **************/
    bindAMembers(event){
        this.ATeamMembers = event.detail.value;
    }

    /************** Method to bind values to B Team Members text area **************/
    bindBMembers(event){
        this.BTeamMembers = event.detail.value;
    }

    /************** Method to bind values to A Team Name text **************/
    bindATeamName(event){
        this.ATeamName = event.detail.value;
    }
    
    /************** Method to bind values to B Team Name text **************/
    bindBTeamName(event){
        this.BTeamName = event.detail.value;
    }
    
    /************** Method to display Modal window **************/
    setUpTeams(){
        this.teamsReady = false;
    }

    /************** Method to close Modal window and initiate Game **************/
    assignTeams(){
        this.teamsReady = true;
        this.randomize();
    }

    /************** Method to reset the Team A & Team B scores **************/
    resetProgress(){
        this.ATeamPoints = 0;
        this.BTeamPoints = 0;
        this.gameOver = false;
        this.randomize();
    }

    /************** Method to pick a random movie from the JSON for guessing. It defaults all the flags as well **************/
    randomize(){
        this.currentPoints = 10;
        this.showAnswer = false;
        this.showHints = false;
        this.disableA = false;
        this.disableB = false;
        this.randomData =  this.allData[Math.floor(Math.random() * this.allData.length)];
        if(this.displayedSet.includes(this.randomData.ranking)){
            this.randomize();
        } else {
            this.displayedSet.push(this.randomData.ranking); // added so that same movie does now show up again after randomization
        }
        this.randomData.director = this.randomData.director.filter(x => x).join(', ');
        this.randomData.writers = this.randomData.writers.filter(x => x).join(', ');
        this.randomData.stars = this.randomData.stars.filter(x => x).join(', ');
        this.randomData.genres = this.randomData.genres.filter(x => x).join(', ');
    }

    /************** Method to reveal Hints prior to revealing answer and reduce points by 5 **************/
    revealHints(){
        this.showHints = true;
        this.currentPoints = this.currentPoints - 5;
    }

    /************** Method to reveal the Movie contents **************/
    revealAnswer(){
        this.showAnswer = true;
        this.showHints = true;
    }

    /************** Method to add current Points to Team A **************/
    addPointsToA(){
        this.ATeamPoints = this.ATeamPoints + this.currentPoints;
        this.disableA = true;
        this.gameOver = this.ATeamPoints>=100 || this.BTeamPoints>=100;
    }

    /************** Method to add current Points to Team B **************/
    addPointsToB(){
        this.BTeamPoints = this.BTeamPoints + this.currentPoints;
        this.disableB = true;
        this.gameOver = this.ATeamPoints>=100 || this.BTeamPoints>=100;
    }
    
    /************** getter Method to dynamically uppdate Winner team when score touches 100 **************/
    get winnerTeam(){
        return this.ATeamPoints>=100 ? this.ATeamName : this.BTeamName;
    }

    /************** getter Method to dynamically uppdate Winner team Members when score touches 100 **************/
    get winnerTeamMembers(){
        return this.ATeamPoints>=100 ? this.ATeamMembers : this.BTeamMembers;
    }

     /************** Method to check and switch Full HTML between Dark mode and Light mode **************/
    checkmode() {
        if (!this.darkmode) {
            // Remove Dark Mode styles
            Array.from(this.template.querySelectorAll(".lgc-bg-inverse")).forEach(ele => {
                ele.classList.add("not-dark");
                ele.classList.remove("lgc-bg-inverse");
            });
            Array.from(this.template.querySelectorAll(".slds-text-color_inverse")).forEach(ele => {
                ele.classList.add("not-dark-text");
                ele.classList.remove("slds-text-color_inverse");
            });
            Array.from(this.template.querySelectorAll(".dark-bg")).forEach(ele => {
                ele.classList.add("light-bg");
                ele.classList.remove("dark-bg");
            });
        } else {
            // Enable Dark Mode Styles
            Array.from(this.template.querySelectorAll(".not-dark")).forEach(ele => {
                ele.classList.add("lgc-bg-inverse");
                ele.classList.remove("not-dark");
            });
            Array.from(this.template.querySelectorAll(".not-dark-text")).forEach(ele => {
                ele.classList.add("slds-text-color_inverse");
                ele.classList.remove("not-dark-text");
            });
            Array.from(this.template.querySelectorAll(".light-bg")).forEach(ele => {
                ele.classList.add("dark-bg");
                ele.classList.remove("light-bg");
            });
        }
    }

    /************** Method to Toggle between Dark mode and Light mode **************/
    togglemode() {
        this.darkmode = !this.darkmode;
        this.checkmode();
    }
}