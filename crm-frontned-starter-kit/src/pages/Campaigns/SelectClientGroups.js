import { useState, useEffect } from "react";
import { Accordion } from "react-bootstrap";
import {
  Col, Input, Row
} from "reactstrap";
import { startCase } from "lodash";

function SelectClientGroups({ groups, selectedGroups, getSelectedGroups }) {
  // turn null values into undefined to allow checkbox to be unchecked
  if (selectedGroups?.length > 0)
    selectedGroups.forEach(
      (group) => {
        if (group.list.length === 1 && group.list[0] === null) {
          group.list = [undefined];
        }
      });

  const [checkedItems, setCheckedItems] = useState(selectedGroups || []);

  useEffect(() => {
    getSelectedGroups(checkedItems);
  }, [checkedItems]);

  const handleCheckboxChange = (e, key, item) => {
    if (e.target.checked) {
      // Checkbox is checked
      if (groups[key].length === 1) {
        // Group has only one item
        setCheckedItems([
          ...checkedItems,
          {
            name: key,
            list: [item._id]
          },
        ]);
      } else {
        // Group has multiple items
        const updatedItems = checkedItems.map((checkedItem) => {
          if (checkedItem.name === key) {
            // Append item to existing list
            return {
              ...checkedItem,
              list: [...checkedItem.list, item._id],
            };
          }
          return checkedItem;
        });
        const newItem = {
          name: key,
          list: [item._id]
        };
        if (!updatedItems.some((checkedItem) => checkedItem.name === key)) {
          // Group not found in existing items
          setCheckedItems([...updatedItems, newItem]);
        } else {
          // Update existing group
          setCheckedItems(updatedItems);
        }
      }
    } else {
      // Checkbox is unchecked
      const updatedItems = checkedItems.map((checkedItem) => {
        if (checkedItem.name === key) {
          // Remove item from list
          return {
            ...checkedItem,
            list: checkedItem.list.filter((id) => id !== item._id),
          };
        }
        return checkedItem;
      });
      // Remove group if list is empty
      const filteredItems = updatedItems.filter(
        (checkedItem) => checkedItem.list.length > 0
      );
      setCheckedItems(filteredItems);
    }
  };

  return (
    <Accordion defaultActiveKey="0">
      {groups &&
        Object.entries(groups).map(([key, value]) =>
          value.length === 1 ? (
            <div className="border border-1 p-3" key={key}>
              <Input
                type="checkbox"
                name="groups"
                className="me-1"
                value={key}
                onChange={(e) =>
                  handleCheckboxChange(e, key, value[0])
                }
                checked={checkedItems.some((item) => item.name === key)}
              />
              {`${startCase(key)} (${value[0].count})`}
            </div>
          ) : (
            <Accordion.Item className="p-0" eventKey={key} key={key}>
              <Accordion.Header>{startCase(key)}</Accordion.Header>
              <Accordion.Body className="py-1">
                <Row>
                  {value.map((item) => (
                    <Col md={4} key={item._id}>
                      <Input
                        type="checkbox"
                        name="groups"
                        className="me-1"
                        value={item._id}
                        onChange={(e) =>
                          handleCheckboxChange(e, key, item)
                        }
                        checked={
                          checkedItems.some(
                            (checkedItem) =>
                              checkedItem.name === key &&
                              checkedItem.list.includes(item._id)
                          )
                        }
                      />
                      {`${startCase(item._id)} (${item.count})`}
                    </Col>
                  ))}
                </Row>
              </Accordion.Body>
            </Accordion.Item>
          )
        )}
    </Accordion>
  );
}

export default SelectClientGroups;
