// src/services.js
import React from 'react';
import { List, Datagrid, TextField, EditButton, Create, SimpleForm, TextInput, Edit } from 'react-admin';

export const ServiceList = (props) => (
    <List {...props}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="price" />
            <EditButton />
        </Datagrid>
    </List>
);

export const ServiceEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="title" />
            <TextInput source="description" />
            <TextInput source="price" />
        </SimpleForm>
    </Edit>
);

export const ServiceCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="title" />
            <TextInput source="description" />
            <TextInput source="price" />
        </SimpleForm>
    </Create>
);
