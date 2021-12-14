import React from 'react'
import { compose } from 'redux'
import { Field, reduxForm } from 'redux-form'
import { TextField, Button } from '@material-ui/core'

let NicknameForm = props => {
    const { handleSubmit } = props

    return (
        <form onSubmit={handleSubmit}>
            <Field
                name='nickname'
                type='text'
                component={TextField}/>

            <Button type='submit'>Start</Button>

        </form>
    )
}

export default NicknameForm = compose(reduxForm({
    form: 'nickname'
}))(NicknameForm)