import React from 'react';

import {
  CardContent,
  Button as MuiButton,
  Card as MuiCard,
  Paper as MuiPaper,
  TextField as MuiTextField,
  Grid,
  Switch
} from '@material-ui/core';

import { spacing } from '@material-ui/system';
import styled from 'styled-components';
import { KeyboardDatePicker } from '@material-ui/pickers';
import CommonSelect from '../CommonSelect';

const Card = styled(MuiCard)(spacing);
const Paper = styled(MuiPaper)(spacing);
const TextFieldSpacing = styled(MuiTextField)(spacing);
const TextField = styled(TextFieldSpacing)`
  width: 200px;
`;

const Button = styled(MuiButton)(spacing);

function DynamicForm(props) {
  const { formFieldList, onFormFieldChange, showBtn, onBtnClick, onFormFieldBlur, spacing, isAll } =
    props;

  const handleDataChange = (value, id, i) => {
    const data = {
      target: {
        value
      }
    };
    onFormFieldChange(data, id);
  };
  return (
    <Card mb={6}>
      <CardContent>
        <Paper mt={0}>
          <form noValidate autoComplete="off">
            <Grid container spacing={spacing || 3}>
              {formFieldList &&
                formFieldList.map((field, i) => {
                  if (isAll || field.showOnRequest) {
                    switch (field.type) {
                      case 'text':
                        return (
                          <TextField
                            id={field.id.toString()}
                            key={field.id + field.label}
                            label={field.label}
                            type={field.type}
                            defaultValue={field.value || ''}
                            error={field.error || false}
                            helperText={field.helperText || ''}
                            disabled={field.disabled || false}
                            variant="outlined"
                            required={field.required || false}
                            onChange={
                              !field.readOnly && onFormFieldChange
                                ? (event) => onFormFieldChange(event, field.id, i)
                                : null
                            }
                            onBlur={
                              !field.readOnly && onFormFieldBlur
                                ? (e) => onFormFieldBlur(e, field.id)
                                : null
                            }
                            InputProps={{
                              readOnly: field.readOnly
                            }}
                            InputLabelProps={{
                              shrink: field.type === 'date' ? true : undefined
                            }}
                            style={{ marginTop: '5ch', marginRight: '10ch' }}
                          />
                        );
                      case 'date':
                        return (
                          <KeyboardDatePicker
                            clearable="true"
                            variant="inline"
                            inputVariant="outlined"
                            key={field.id + field.label}
                            views={field.views ? field.views : undefined}
                            format={field.views ? 'yyyy' : 'yyyy / MM / dd'}
                            label={field.label}
                            error={field.error || false}
                            helperText={field.helperText || ''}
                            value={field.value === '' ? null : field.value}
                            style={{ marginTop: '5ch', marginRight: '10ch' }}
                            disabled={field.readOnly}
                            onChange={(event) => handleDataChange(event, field.id, i)}
                          />
                        );
                      case 'boolean':
                        return (
                          <Switch
                            checked={field.value}
                            onChange={(event) => handleDataChange(event, field.id, i)}
                            color="primary"
                            key={field.id + field.label}
                            inputProps={{ 'aria-label': 'primary checkbox' }}
                            style={{ marginTop: '5ch', marginRight: '10ch' }}
                          />
                        );
                      case 'select':
                        return (
                          <CommonSelect
                            id={field.id.toString()}
                            key={field.id + field.label}
                            label={field.label}
                            error={field.error || false}
                            helperText={field.helperText || ''}
                            // value={field.value || ''}
                            value={field.value || ''}
                            disabled={field.disabled || false}
                            outlined
                            itemList={field.itemList}
                            labelField={field.labelField}
                            valueField={field.valueField}
                            width={1}
                            hasMt
                            onSelectChange={
                              !field.readOnly
                                ? (event) => onFormFieldChange(event, field.id, i)
                                : null
                            }
                          />
                        );
                      default:
                        return (
                          <TextField
                            id={field.id}
                            key={field.id + field.label}
                            label={field.label}
                            type={field.type}
                            error={field.error || false}
                            helperText={field.helperText || ''}
                            disabled={field.disabled || false}
                            variant="outlined"
                            required={field.required || false}
                            onChange={
                              !field.readOnly ? (event) => onFormFieldChange(event, field.id) : null
                            }
                            onBlur={
                              !field.readOnly && onFormFieldBlur
                                ? (e) => onFormFieldBlur(e, field.id)
                                : null
                            }
                            value={field.value}
                            InputProps={{
                              readOnly: field.readOnly
                            }}
                            InputLabelProps={{
                              shrink: field.type === 'date' ? true : undefined
                            }}
                            style={{ marginTop: '5ch', marginRight: '10ch' }}
                          />
                        );
                    }
                  } else {
                    return '';
                  }
                })}
            </Grid>
          </form>
        </Paper>
        {showBtn && (
          <Grid
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            style={{ marginTop: '5ch' }}
          >
            <Button color="primary" variant="contained" onClick={() => onBtnClick()}>
              Save
            </Button>
          </Grid>
        )}
      </CardContent>
    </Card>
  );
}

export default DynamicForm;
