// src/experts.js
import React from 'react';
import { List, Datagrid, TextField, EditButton, Create, SimpleForm, TextInput, Edit } from 'react-admin';

export const ExpertList = (props) => (
    <List {...props}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="title" />
            <EditButton />
        </Datagrid>
    </List>
);

export const ExpertEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="name" />
            <TextInput source="title" />
            <TextInput source="expertise" />
        </SimpleForm>
    </Edit>
);

export const ExpertCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="name" />
            <TextInput source="title" />
            <TextInput source="expertise" />
        </SimpleForm>
    </Create>
);
