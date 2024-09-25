// src/users.js
import React from 'react';
import { List, Datagrid, TextField, EditButton, Create, SimpleForm, TextInput, Edit } from 'react-admin';

export const UserList = (props) => (
    <List {...props}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="username" />
            <TextField source="email" />
            <EditButton />
        </Datagrid>
    </List>
);

export const UserEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="username" />
            <TextInput source="email" />
            <TextInput source="phone_number" />
        </SimpleForm>
    </Edit>
);

export const UserCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="username" />
            <TextInput source="email" />
            <TextInput source="phone_number" />
            <TextInput source="password" type="password" />
        </SimpleForm>
    </Create>
);
