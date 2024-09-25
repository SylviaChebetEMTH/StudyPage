// src/AdminPanel.js
import React from 'react';
import { Admin, Resource, ListGuesser, EditGuesser } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';
import { UserList, UserEdit, UserCreate } from './users'; // import user components
import { ExpertList, ExpertEdit, ExpertCreate } from './experts'; // import expert components
import { ServiceList, ServiceEdit, ServiceCreate } from './services'; // import service components

const dataProvider = jsonServerProvider('http://localhost:5000'); // Adjust the endpoint

const AdminPanel = () => (
    <Admin dataProvider={dataProvider}>
        <Resource name="users" list={UserList} edit={UserEdit} create={UserCreate} />
        <Resource name="experts" list={ExpertList} edit={ExpertEdit} create={ExpertCreate} />
        <Resource name="services" list={ServiceList} edit={ServiceEdit} create={ServiceCreate} />
    </Admin>
);

export default AdminPanel;
