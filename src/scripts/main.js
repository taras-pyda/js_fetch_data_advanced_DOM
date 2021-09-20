'use strict';

const api = 'https://mate-academy.github.io/phone-catalogue-static/api';
const endPoint = '/phones';
const body = document.body;

const phonesIds = fetch(`${api}${endPoint}.json`)
  .then(respone => respone.json())
  .then(phones => phones.map(phone => phone.id));

const getFirstReceivedDetails = (arrIds) => {
  return arrIds
    .then(ids => {
      return ids.map(id => {
        return fetch(`${api}${endPoint}/${id}.json`)
          .then(response => response.json());
      });
    })
    .then(promises => Promise.race(promises));
};

const getAllSuccessfulDetails = (arrIds) => {
  return arrIds
    .then(ids => {
      return ids.map(id => {
        return fetch(`${api}${endPoint}/${id}.json`)
          .then(response => response.json());
      });
    })
    .then(promises => Promise.all(promises));
};

const showList = (className, arr) => {
  const newArr = (Object.getPrototypeOf(arr) !== Array.prototype)
    ? [arr]
    : arr;

  const tittleText = className
    .split('-')
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(' ');

  const element = `
    <div class="${className}">
      <h3>${tittleText}</h3>
      <ul></ul>
    </div>
  `;

  body.insertAdjacentHTML('beforeend', element);

  const ul = body.querySelector(`.${className}`).querySelector('ul');

  newArr.forEach(value => {
    const liWithId = `<li>ID: ${value.id}`;
    const liWithName = `<li>Name: ${value.name}`;

    ul.insertAdjacentHTML('beforeend', liWithName);
    ul.insertAdjacentHTML('beforeend', liWithId.toUpperCase());
  });
};

getFirstReceivedDetails(phonesIds)
  .then(firstReceivedDetails => {
    showList('first-received', firstReceivedDetails);
  });

getAllSuccessfulDetails(phonesIds)
  .then(allSuccessfulDetails => {
    showList('all-successful', allSuccessfulDetails);
  });

const getThreeFastestDetails = async function(idsArr) {
  const threeFastestDetails = [];
  let newIds = idsArr;

  for (let i = 0; i < 3; i++) {
    threeFastestDetails.push(await getFirstReceivedDetails(newIds));

    newIds = newIds.then(ids => {
      return ids.filter(newId => newId !== threeFastestDetails[i].id);
    });
  }

  return threeFastestDetails;
};

getThreeFastestDetails(phonesIds);
