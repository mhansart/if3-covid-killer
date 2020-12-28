import './styles.scss';
import { vaccins } from './src/data';

const h = window.innerHeight;
const style = document.createElement('style');
document.head.appendChild(style);
style.sheet.insertRule(`body {height: ${h}px}`);

const app = document.getElementById('app');
// creation du header
const header = `
                <header>
                    <h1>Covid Killer</h1>
                    <div class="d-flex">
                        <div class="classer-prix">Par prix croissants</div>
                        <div class="vaccins-approuves">Vaccins approuvés</div>
                    </div>
                </header>`;
app.innerHTML += header;

// creation du main
const main = '<main class="container"></main>';
app.innerHTML += main;

// creation du footer
const footer = `
                <footer class="d-flex jc-between">
                <div class="d-flex ai-center">
                    <i class="fas fa-shopping-bag"><span class="panier-quantite">0</span></i>
                    <p class="prix"><span class="prix-total">0</span>$</p>
                </div>
                <div class="panier">Votre panier est vide</div>
                <div><button class="vider">Vider le panier</button><button class="commander">Passer commande</button></div>
                </footer>`;
app.innerHTML += footer;

// tableau pour checker si le vaccin a déjà été réservé
const isDisabled = [];
vaccins.forEach(() => {
  isDisabled.push(false);
});

// fonction render pour remplir le main
const render = (arr, container) => {
  container.innerHTML = ' ';
  arr.forEach((elt, i) => {
    const {
      nom, inventeurs, production, technologie, quantité, prix,
    } = elt;
    const idxVaccin = vaccins.findIndex((x) => nom === x.nom);
    let picture = (nom).toLowerCase();
    const btnDisabled = isDisabled[idxVaccin] === true ? 'disabled' : '';
    picture = picture.includes('.') ? picture.replaceAll('.', '-') : picture.replaceAll(' ', '-');
    container.innerHTML += `
                      <div id="vaccin-${i}" class="vaccin-card">
                          <div>
                              <div class="vaccin-picture">
                                  <img src="${picture}.jpg"/>
                              </div>
                              <div class="infos">
                                  <h3>${nom}</h3>
                                  <p class="d-flex jc-between ai-center"><span>Inventeurs: </span><span class="bold">${inventeurs.join(', ')}</span></p>
                                  <p class="d-flex jc-between ai-center"><span>Lieux de production: </span><span class="bold">${production.join(', ')}</span></p>
                                  <p class="technologie d-flex jc-between ai-center"><span>Technologie: </span><span class="bold">${technologie}</span></p>
                                  <p class=" d-flex jc-between ai-center"><span>Quantité disponible: </span><span class="bold quantity">${quantité}</span></p>
                                  <p class="prix">Prix: <span class="bold">${prix}$</span></p>
                                  <div class="reservation d-flex jc-between">
                                      <input min="0" max="${quantité}" class="quantite" value="0" type="number"/>
                                      <button class="reserver" ${btnDisabled}>Réserver</button>
                                  </div>
                              </div>
                          </div>
                      </div>`;
  });
};
const mainContainer = document.querySelector('.container');
render(vaccins, mainContainer);

const vaccinsApprouves = document.querySelector('.vaccins-approuves');
const parPrix = document.querySelector('.classer-prix');
// fonction pour trier les vaccins
const toSortBy = () => {
  let triParPrix;
  if (parPrix.classList.contains('active')) {
    const sortByMapped = (map, compareFn) => (a, b) => compareFn(map(a), map(b));
    const byValue = (a, b) => a - b;
    const toPrice = (e) => e.prix;
    const byPrice = sortByMapped(toPrice, byValue);
    triParPrix = vaccins.sort(byPrice);
  } else {
    triParPrix = vaccins;
  }
  const approuves = triParPrix.filter((x) => x.approuvé === true);
  const vaccinsShowed = vaccinsApprouves.innerHTML === 'Tous les vaccins' ? approuves : triParPrix;
  render(vaccinsShowed, mainContainer);
};

// clic sur les != btns
vaccinsApprouves.addEventListener('click', () => {
  vaccinsApprouves.innerHTML = vaccinsApprouves.innerHTML === 'Tous les vaccins' ? 'Vaccins approuvés' : 'Tous les vaccins';
  toSortBy();
});

const commander = document.querySelector('.commander');
commander.setAttribute('disabled', 'disabled');
const panier = document.querySelector('.panier');
const panierQuantite = document.querySelector('.panier-quantite');
const prixTotal = document.querySelector('.prix-total');

// toggle pour voir le contenu du panier
const openPanier = document.querySelector('.fa-shopping-bag');
openPanier.addEventListener('click', () => {
  panier.classList.toggle('d-block');
});
// classer les bouton par prix
parPrix.addEventListener('click', () => {
  parPrix.classList.add('active');
  toSortBy();
});
// vider le panier
const vider = document.querySelector('.vider');
vider.addEventListener('click', () => {
  panier.innerHTML = 'Votre panier est vide';
  prixTotal.innerHTML = '0';
  panierQuantite.innerHTML = '0';
  const reserver = document.querySelectorAll('.reserver');
  reserver.forEach((x) => {
    x.removeAttribute('disabled');
  });
});
// passer la commande
commander.addEventListener('click', () => {
  const totalCommande = prixTotal.innerHTML;
  const recap = panier.innerHTML;
  app.innerHTML = `<div class="d-flex ai-center commande-acceptee"><div class="d-flex"><p>La commande a bien été enregistrée</p>
                    <div>${recap}</div>
                    <p>Le total de votre commande est de ${totalCommande}$</p>
                    <button class="annuler">Annuler la commande</div></div></div>`;
});
// reload la page à partir de la page finale
const body = document.querySelector('body');
body.addEventListener('click', (e) => {
  if (e.target.classList.contains('annuler')) {
    document.location.reload();
  }
  if (e.target.classList.contains('reserver')) {
    const btn = e.target;
    const ipt = btn.previousElementSibling;
    // S'il y a une certaine quantité
    if (ipt.value !== '0') {
      const vaccinId = vaccins.findIndex((x) => btn.closest('.infos').querySelector('h3').innerHTML === x.nom);
      const oneVaccin = `<li class="d-flex jc-between ai-center"><span>${vaccins[vaccinId].nom} x${ipt.value}</span> <span>${parseInt(ipt.value, 10) * parseFloat(vaccins[vaccinId].prix)}$</li>`;
      panier.innerHTML = panier.innerHTML === 'Votre panier est vide' ? oneVaccin : panier.innerHTML + oneVaccin;
      panierQuantite.innerHTML = parseInt(panierQuantite.innerHTML, 10) + parseInt(ipt.value, 10);
      prixTotal.innerHTML = parseFloat(prixTotal.innerHTML) + (parseInt(ipt.value, 10) * parseFloat(vaccins[vaccinId].prix));
      ipt.value = 0;
      //   On ne peut plus réserver ce vaccin
      btn.setAttribute('disabled', 'disabled');
      isDisabled[vaccinId] = true;
      console.log(isDisabled);
      //   on peut passer la commande totale
      commander.removeAttribute('disabled');
    }
  }
});
