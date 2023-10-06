export default class Patient{
    ID;
    LocationID;
    FirstName;
    LastName;
    Age;
    Sex;
    Residence;
    CauseOfDeath;
    DateOfDeath;
    Covid;
    DateCreated;
    constructor(data){
        this.ID = data?.ID;
        this.LocationID = data?.LocationID;
        this.FirstName = data?.FirstName;
        this.LastName = data?.LastName;
        this.Age = data?.Age;
        this.Sex = data?.Sex;
        this.Residence = data?.Residence;
        this.CauseOfDeath = data?.CauseOfDeath;
        this.DateOfDeath = data?.DateOfDeath;
        this.Covid = data?.Covid;
        this.DateCreated = data?.DateCreated;
    }
}