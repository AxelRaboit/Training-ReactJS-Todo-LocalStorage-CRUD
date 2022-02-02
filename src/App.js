import React, { useState, useEffect } from 'react';
import List from './components/List';
import Alert from './components/Alert';
import './App.css';

//Fonction permettant de récuperer le local strage
const getLocalStorage = () => {
  //On stock la list en accedant au getItem de localStorage en précisant quel item prendre
  let list = localStorage.getItem("list");
  //Si une list existe alors on retourne la liste tout en parsant le JSON
  if(list){
    return (list = JSON.parse(localStorage.getItem("list")));
    //Sinon on retourne un tableau vide
  } else {
    return [];
  }
}

const App = () => {

  //
  const [name, setName] = useState('');
  //Création du state pour la liste, avec comme valeur par default le localstorage, qui soit renvoi la liste soit renvoi un tableau vide
  const [list, setList] = useState(getLocalStorage());
  //Création du state pour l'edition qui par default est sur "false" permettant d'afficher soit le bouton "Soumettre" ou "Modifier"
  const [isEditing, setIdEditing] = useState(false);
  //Création du state pour l'id de l'edit, qui par default est sur "null"
  const [editId, setEditId] = useState(null);
  //Création du state pour le message d'alert concernant les actions effectué du crud, avec leurs valeurs par default
  const [alert, setAlert] = useState({show: false, msg: '', type: ''});

  //Ceci permet de setter l'item dans le local storage, lors de l'action mettant en action le state "list"
  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);

  //Function lors de la soumission du formulaire
  const handleSubmit = (e) => {
    //Arrete le processus par default d'un formulaire qui est de rafraichir la page
    e.preventDefault();
    //Si nous soumettons le formulaire sans y écrire de valeur dans l'input, alors nous activons le popup par true et mettons un message d'alerte
    if(!name) {
      showAlert(true, "danger", "Entrez une valuer, svp.");
      //Condition permettant la modification d'un item
    } else if(name && isEditing) {
      setList(
        //On récupere la liste, et on cherche l'item qui match avec celui que l'on veut modifier
        list.map((item) => {
          if(item.id === editId) {
            return {...item, title: name}
          }
          return item;
        })
      );
      //Permet de ne plus affiché ce que l'on a tapé dans l'input, après l'action
      setName("");
      //Remise à la valeur initial
      setEditId(null);
      //Remise à la valeur initial
      setIdEditing(false);
      //Affichage du message d'alert
      showAlert(true, "success", "Tâche modifiée");
      //Condition d'ajout d'un item
    } else {
      //Affichage du message d'alert
      showAlert(true, "success", "Tâche ajoutée à la liste");
      //Création de la variable du nouvel item
      const newItem = {id: new Date().getTime().toString(), title: name};
      //Mise en list du nouveau item
      setList([...list, newItem]);
      //Permet de ne plus affiché ce que l'on a tapé dans l'input, après l'action
      setName("");
    }
  };

  //Variable du message d'alert avec ses valeurs par default
  const showAlert = (show = false, type = "", msg = "") => {
    setAlert({show, type, msg});
  }

  //Variable permettant en prenant en parametre un id d'afficher un message d'alert et de retirer l'item de la liste
  const removeItem = (id) => {
    showAlert(true, "danger", "Tâche effacé");
    setList(list.filter((item) => item.id !== id));
  }

  //Variable permettant l'edition prenant en parametre l'id
  const editItem = (id) => {
    const editItem = list.find((item) => item.id === id);
    setIdEditing(true);
    setEditId(id);
    setName(editItem.title);
  }

  //Variable permettant de supprimer toute la liste To-do, de remettre le table vide
  const clearList = () => {
    showAlert(true, "danger", "Empty List");
    setList([]);
  }

  return (
    <section className='section-center'>
      <form onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
        <h3 style={{marginBottom: "1.5rem", textAlign: "center"}}>
          Todo List utilisant le Local Storage
        </h3>
        <div className='mb-3 form'>
          <input 
            type="text"
            className='form-control'
            placeholder='ex: Acheter du pain'
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <button type='submit' className='btn btn-success'>
            {isEditing ? "Modifier" : "Soumettre"}
          </button>
        </div>
      </form>
      {list.length > 0 && (
        <div style={{marginTop: '2rem'}}>
          <List items={list} removeItem={removeItem} editItem={editItem}/>
          <div className='text-center'>
            <button className='btn btn-warning' onClick={clearList}>Effacer la liste</button>
          </div>
        </div>
      )}
    </section>
  );
}

export default App;
