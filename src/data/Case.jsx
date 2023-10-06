import Contact from "./Contact";
import Service from "./Service";
import Patient from "./Patient";
import Home from "./Home";
import User from "./User";
export default class Case{
    ID;
    DisplayID;
    Status;
    LocationID;
    PreArranged;
    DateCreated;
    DateCompleted;
    Contact;
    Service;
    Patient;
    Home;
    User;
    Tasks;

    constructor(data){
        this.ID = data?.ID;
        this.DisplayID = data?.DisplayID;
        this.Status = data?.Status;
        this.LocationID = data?.LocationID;
        this.PreArranged = data?.PreArranged;
        this.DateCreated = data?.DateCreated;
        this.DateCompleted = data?.DateCompleted;
        this.Service = new Service(data?.Service);
        this.Contact = new Contact(data?.Contact);
        this.Patient = new Patient(data?.Patient);
        this.Home = new Home(data?.Home);
        this.User = new User(data?.User);
        this.Tasks = data?.Tasks;
    }
}