/*
 * Copyright © 2016-2021 The Thingsboard Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as React from 'react';
import JsonFormUtils from './json-form-utils';
import { JsonFormFieldProps, JsonFormFieldState } from '@shared/components/json-form/react/json-form.models';

export default ThingsboardBaseComponent => class<P extends JsonFormFieldProps>
  extends React.Component<P, JsonFormFieldState> {

    constructor(props) {
        super(props);
        this.onChangeValidate = this.onChangeValidate.bind(this);
        const value = this.defaultValue();
        const validationResult = JsonFormUtils.validate(this.props.form, value);
        this.state = {
            value,
            valid: !!(validationResult.valid || !value),
            error: !validationResult.valid && value ? validationResult.error.message : null
        };
    }

    componentDidMount() {
        if (typeof this.state.value !== 'undefined') {
            this.props.onChange(this.props.form.key, this.state.value);
        }
    }

    onChangeValidate(e, forceUpdate?: boolean) {
        let value = null;
        if (this.props.form.schema.type === 'integer' || this.props.form.schema.type === 'number') {
            if (e.target.value === null || e.target.value === '') {
                value = undefined;
            } else if (e.target.value.indexOf('.') === -1) {
                value = parseInt(e.target.value, 10);
            } else {
                value = parseFloat(e.target.value);
            }
        } else if (this.props.form.schema.type === 'boolean') {
            value = e.target.checked;
        } else if (this.props.form.schema.type === 'date' || this.props.form.schema.type === 'array') {
            value = e;
        } else { // string
            value = e.target.value;
        }
        const validationResult = JsonFormUtils.validate(this.props.form, value);
        this.setState({
            value,
            valid: validationResult.valid,
            error: validationResult.valid ? null : validationResult.error.message
        });
        this.props.onChange(this.props.form.key, value, forceUpdate);
    }

    defaultValue() {
        let value = JsonFormUtils.selectOrSet(this.props.form.key, this.props.model);
        if (this.props.form.schema.type === 'boolean') {
            if (typeof value !== 'boolean' && typeof this.props.form.default === 'boolean') {
                value = this.props.form.default;
            }
            if (typeof value !== 'boolean' && this.props.form.schema && typeof this.props.form.schema.default === 'boolean') {
                value = this.props.form.schema.default;
            }
            if (typeof value !== 'boolean' &&
                this.props.form.schema &&
                this.props.form.required) {
                value = false;
            }
        } else if (this.props.form.schema.type === 'integer' || this.props.form.schema.type === 'number') {
            if (typeof value !== 'number' && typeof this.props.form.default === 'number') {
                value = this.props.form.default;
            }
            if (typeof value !== 'number' && this.props.form.schema && typeof this.props.form.schema.default === 'number') {
                value = this.props.form.schema.default;
            }
            if (typeof value !== 'number' && this.props.form.titleMap && typeof this.props.form.titleMap[0].value === 'number') {
                value = this.props.form.titleMap[0].value;
            }
            if (value && typeof value === 'string') {
                if (value.indexOf('.') === -1) {
                    value = parseInt(value, 10);
                } else {
                    value = parseFloat(value);
                }
            }
        } else {
            if (!value && typeof this.props.form.default !== 'undefined') {
                value = this.props.form.default;
            }
            if (!value && this.props.form.schema && typeof this.props.form.schema.default !== 'undefined') {
                value = this.props.form.schema.default;
            }
            if (!value && this.props.form.titleMap && typeof this.props.form.titleMap[0].value !== 'undefined') {
                value = this.props.form.titleMap[0].value;
            }
        }
        return value;
    }

    render() {
        if (this.props.form && this.props.form.schema) {
            return <ThingsboardBaseComponent {...this.props} {...this.state} onChangeValidate={this.onChangeValidate}/>;
        } else {
            return <div></div>;
        }
    }
};
