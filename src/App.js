import React, { useState, useEffect } from 'react';
import { Container, TextField, Button } from '@mui/material';
import MultiSelectDropdown from './components/MultiSelectDropdown';
import PreviewList from './components/PreviewList';

function App() {
  const [totalAmount, setTotalAmount] = useState(500);
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [preview, setPreview] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  useEffect(() => {
    fetch('/users.json')
      .then(response => response.json())
      .then(data => setUsers(data));
    
    fetch('/items.json')
      .then(response => response.json())
      .then(data => setItems(data));
  }, []);

  const handleSave1 = () => {
    let newPreview = [...preview];
  
    selectedUsers.forEach(user => {
      const existingUserIndex = newPreview.findIndex(p => p.user === user);
  
      const newItems = selectedItems.map(itemId => {
        const item = items.find(i => i.id === itemId);
        return { ...item, quantity: 1 }; // Initial quantity is 1
      });
  
      if (existingUserIndex !== -1) {
        // User already exists, update their items
        let existingItems = [...newPreview[existingUserIndex].items];
  
        // Update quantities or add new items
        newItems.forEach(newItem => {
          const existingItemIndex = existingItems.findIndex(item => item.id === newItem.id);
  
          if (existingItemIndex !== -1) {
            // If the item already exists, update its quantity
            existingItems[existingItemIndex].quantity += 1;
          } else {
            // If the item is new, add it
            existingItems.push(newItem);
          }
        });
  
        // Remove items that are no longer selected (deselected items)
        existingItems = existingItems.filter(item => selectedItems.includes(item.id));
  
        // Calculate updated total after removing deselected items
        const updatedTotal = existingItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
        // Update the user entry in the preview list
        if (existingItems.length > 0) {
          newPreview[existingUserIndex] = {
            ...newPreview[existingUserIndex],
            items: existingItems,
            total: updatedTotal,
          };
        } else {
          // If no items are left, remove the user from the preview list
          newPreview.splice(existingUserIndex, 1);
        }
      } else {
        // Adding new user
        const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        newPreview.push({ user, items: newItems, total });
      }
    });
  
    // Update the preview state
    setPreview(newPreview);
  
    // Clear selections and editing state
    setSelectedUsers([]);
    setSelectedItems([]);
    setIsEditing(false);
    setEditingUser(null);
  
    // Update the grand total
    const grandTotal = newPreview.reduce((sum, { total }) => sum + total, 0);
    setGrandTotal(grandTotal);
  };
          
const handleSave = () => {
  let newPreview = [...preview];
console.log("newPreview ==== ",newPreview)
console.log("selectedUsers ==== ",selectedUsers)

  selectedUsers.forEach(user => {
    console.log("user ==== ",user)

    const existingUserIndex = newPreview.findIndex(p => p.user === user);

    const newItems = selectedItems.map(item => items.find(i => i.id === item));

    if (existingUserIndex !== -1) {
      // User exists: Update items based on current selection
      let existingItems = [...newPreview[existingUserIndex].items];
      newItems.forEach(newItem => {
        const existingItemIndex = existingItems.findIndex(item => item.id === newItem.id);

        if (existingItemIndex !== -1) {
          // If the item already exists, increase its quantity
          existingItems[existingItemIndex] = {
            ...existingItems[existingItemIndex],
            quantity: existingItems[existingItemIndex].quantity + 1,
          };

        } else {
          // If the item is new, add it with quantity 1
          existingItems.push({ ...newItem, quantity: 1 });
        }
      });
      alert ("Before := "+JSON.stringify(existingItems)); 

      // Filter out deselected items
      if (isEditing) {
        existingItems = existingItems.filter(item =>
          selectedItems.includes(item.id)
        );
        setIsEditing(false)

         // Remove items that are no longer selected (deselected items)
         existingItems = existingItems.filter(item => selectedItems.includes(item.id));
  
         // Calculate updated total after removing deselected items
         const updatedTotal = existingItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
   
         // Update the user entry in the preview list
         if (existingItems.length > 0) {
           newPreview[existingUserIndex] = {
             ...newPreview[existingUserIndex],
             items: existingItems,
             total: updatedTotal,
           };
         } else {
           // If no items are left, remove the user from the preview list
           newPreview.splice(existingUserIndex, 1);
         }
      }

      // Calculate updated total (price * quantity)
      const updatedTotal = existingItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      alert ("After := "+JSON.stringify(existingItems)); 

      newPreview[existingUserIndex] = {
        ...newPreview[existingUserIndex],
        items: existingItems,
        total: updatedTotal,
      };
    } else {
      // User does not exist: Add as new entry with quantity 1
      const itemsWithQuantity = newItems.map(item => ({ ...item, quantity: 1 }));
      const total = itemsWithQuantity.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      newPreview.push({ user, items: itemsWithQuantity, total });

      console.log("newPreview.push ==== ",newPreview)

    }
  });

  setPreview(newPreview);
  setSelectedUsers([]);
  setSelectedItems([]);

  // Update the grand total
  const grandTotal = newPreview.reduce((sum, { total }) => sum + total, 0);
  setGrandTotal(grandTotal);
};
  
  const handleEdit = (user) => {
    setIsEditing(true)
    const userPreview = preview.find(p => p.user === user);

    if (userPreview) {
      setSelectedUsers([user]);
      setSelectedItems(userPreview.items.map(item => item.id));
    }
  };

  const handleDelete = (user) => {
    const newPreview = preview.filter(p => p.user !== user);
    setPreview(newPreview);
    const grandTotal = newPreview.reduce((sum, { total }) => sum + total, 0);
    setGrandTotal(grandTotal);
  };

  return (
    <Container>
      <h1>Cafeteria</h1>
      
      <MultiSelectDropdown
        label="Select Users"
        options={users}
        selectedValues={selectedUsers}
        setSelectedValues={setSelectedUsers}
      />
      <MultiSelectDropdown
        label="Select Food Items"
        options={items}
        selectedValues={selectedItems}
        setSelectedValues={setSelectedItems}
      />
      <Button variant="contained" color="primary" onClick={handleSave}>
        Save
      </Button>
      <PreviewList
        preview={preview}
        users={users}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      <h3>Grand Total: {grandTotal}</h3>
    </Container>
  );
}

export default App;