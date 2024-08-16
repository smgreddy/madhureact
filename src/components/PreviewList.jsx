import React from 'react';
import { List, ListItem, ListItemText, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteButton from './DeleteButton';

const PreviewList = ({ preview, users, handleEdit, handleDelete }) => {
  return (
    <div>
      <h2>Preview</h2>
      <List subheader="Preview List of food items">
        {preview.map(({ user, items, total }, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={`User: ${users.find(u => u.id === user).name}`}
              secondary={`Items: ${items.map(item => `'(Q)'${item.quantity} ${item.name} (${item.price})`).join(', ')} - Total: ${total}`}
            />
            <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(user)}>
              <EditIcon />
            </IconButton>
            <DeleteButton onDelete={() => handleDelete(user)} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default PreviewList;
