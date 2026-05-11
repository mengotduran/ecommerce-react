import React from 'react';
import { Typography, List, ListItem, ListItemText, Divider } from '@material-ui/core';

const Review = ({ checkoutToken }) => {
  return (
    <>
      <Typography variant="h6" gutterBottom style={{ fontWeight: 600, color: '#1a1a2e' }}>
        Order Summary
      </Typography>
      <List disablePadding>
        {checkoutToken.live.line_items.map((item) => (
          <ListItem key={item.name} style={{ padding: '10px 0' }}>
            <ListItemText
              primary={
                <Typography variant="body1" style={{ fontWeight: 500, color: '#1a1a2e' }}>
                  {item.name}
                </Typography>
              }
              secondary={`Qty: ${item.quantity}`}
            />
            <Typography variant="body1" style={{ fontWeight: 600 }}>
              {item.line_total.formatted_with_symbol}
            </Typography>
          </ListItem>
        ))}
        <Divider style={{ margin: '8px 0' }} />
        <ListItem style={{ padding: '12px 0' }}>
          <ListItemText
            primary={
              <Typography variant="subtitle1" style={{ fontWeight: 700, color: '#1a1a2e' }}>
                Total
              </Typography>
            }
          />
          <Typography variant="subtitle1" style={{ fontWeight: 700, color: '#e63946' }}>
            {checkoutToken.live.subtotal.formatted_with_symbol}
          </Typography>
        </ListItem>
      </List>
    </>
  );
};

export default Review;
