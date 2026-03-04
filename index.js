// === Constants ===
const BASE = "https://fsa-puppy-bowl.herokuapp.com/api";
const COHORT = "/2512-FTB-CT-WEB-PT"; 
const API = BASE + COHORT;

// State
let dog = [];
let selectedPup;
let teams = [];
let puppies = [];

//This will fetch our data 
async function getPuppies(){
    try{
        const response = await fetch(`${API}/players`);
        const result = await response.json();
        puppies = result.data.players;
        console.log(result)
        render();
    } catch(e){
        console.error(e)
}
}
//This is the second resource that fetches for the teams
async function getTeams(){
    try{
        const response = await fetch (`${API}/teams`);
        const result = await response.json();
        teams = result.data.teams;
        console.log(result);
        render();
    } catch(e){
        console.error()
    }
}

// state components //
// We will be  kicking off our code with add puppy as 
// this is what is going to affect the API above 
// and future components

async function addPuppy(dog){
    try{await fetch(`${API}/players`, {
        method: 'POST',
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(dog),
    }); getPuppies()}catch(e){
        console.error(e);
    }
} 

//this will remove dogs from the roster
async function removeDog(id){
    try{await fetch (`${API}/players/${id}`, {
        method: "DELETE",
    });
    selectedPup = null;
    getPuppies();
    } catch(e) {
        console.error(e)
    }
}

//UI Componenets//

//this is going to show a list of all the dogs out there, 
function listPuppy(){
    const $ul = document.createElement("ul");
    $ul.classList.add("puppies");

    const $players = puppies.map(Puppy);
    $ul.replaceChildren(...$players);
    return $ul;
}

//this is what is going to show the details for each of the puppy when clicked.
function Puppy(dog) {
    const $li = document.createElement("li");
    if(dog.id === selectedPup?.id){
        $li.classList.add("selected");
    }
    $li.innerHTML = `
    <a href="#selected">
    <img src="${dog.imageUrl}" width ="40px"/>
    ${dog.name}
    </a>
    `;
    $li.addEventListener("click", () => getPuppy(dog.id));
    return $li;
}

//the will fetch the data of the single dog in our api
async function getPuppy(id){
    try{
        const response = await fetch(`${API}/players/${id}`);
        const result = await response.json();
        selectedPup = result.data.player;
        render();
    } catch (e) {
        console.error(e);
    }
}


//incase no dog has been picked
function SelectedPup (){
    if(!selectedPup){
        const $p = document.createElement("p");
        $p.textContent = "Please select a dog to play in the Puppy bowl.";
        return $p;
    }
    
// this will display in our front end as soon as the dogs data is rendered , this will show all the details
const $dog = document.createElement("section");
$dog.innerHTML = `
    <h3>${selectedPup.name}</h3>
     <img src="${selectedPup.imageUrl}"/>
    <p><strong>ID:</strong> ${selectedPup.id}</p>
    <p><strong>Breed:</strong> ${selectedPup.breed}</p>
    <p><strong>Status:</strong> ${selectedPup.status}</p>
    <button> Remove from roster </button>
`;
//this will remove dogs from the roster (front end)
const $delete = $dog.querySelector("button");
$delete.addEventListener("click", () => removeDog(selectedPup.id));
return $dog;
}

//Puppy form is where puppies get drafted 
function puppyForm(){
    const $form = document.createElement("form");
    $form.innerHTML = `
    <label>
    Name:
    <input name="name" required /> 
    </label>
    <label>
    Breed
    <input name = "breed" required/>
    </label>
    <label>
    Submit Image(URL):
    <input name ="image" required/>
    </label>
    <label>
    Status:
    <select name ="status">
        <option value="field">Field</option>
        <option value="bench">Bench</option>
    </select>
    </label>
    <button>Submit</button>
    `;
    $form.addEventListener("submit", async(e) =>{
        e.preventDefault();
        const data = new FormData($form);
        console.log(data.get("name"));
        console.log(data.get("breed"));
        console.log(data.get("image"));
        console.log(data.get("status"));
        await addPuppy({
            name: data.get("name"),
            breed: data.get("breed"),
            imageUrl: data.get("image"),
            status:data.get("status"),
        })
    })
    return $form;
}
// This is the Render portion and will bring out
// our front end and back end components
function render(){
    const $app = document.querySelector("#app");
    $app.innerHTML = `
    <h1> Welcome to the Puppy Bowl </h1>
    <main>
        <section> 
            <h2> Players</h2>
            <listPuppy> </listPuppy>
        </section>
        <section id="selected">
        <h2>Player Details</h2> 
        <SelectedPup> </SelectedPup> 
        </section>
        <section> 
        <puppyForm> </puppyForm>
        </section> 
        </main>  
 
       `
       $app.querySelector("listPuppy").replaceWith(listPuppy());
       $app.querySelector("SelectedPup").replaceWith(SelectedPup());
       $app.querySelector("puppyForm").replaceWith(puppyForm());
}

async function init(){
    await getPuppies();
    await getTeams();
    render();
}

init();