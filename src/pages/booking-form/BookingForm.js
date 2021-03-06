import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import addYears from "date-fns/addYears";
import subDays from "date-fns/subDays";
import VehicleType from '../../components/vehicle-type/VehicleType';
import TechnicalError from '../../components/technical-error/TechnicalError';
import BookService from '../../services/book/Book';
import ValidationService from '../../utils/validation/Validation';
import sent from '../../assets/img/icons/sent.png';
import "react-datepicker/dist/react-datepicker.css";
import './BookingForm';
const moment = require('moment');

class BookingForm extends Component {

    constructor(props){
        super(props);
        this.state = {
            email: {
                valid: undefined,
                focus: false,
                max: 50
            },
            fullname: {
                valid: undefined,
                focus: false,
                min: 5,
                max: 50
            },
            contactNo: {
                valid: undefined,
                focus: false,
                value:'',
                min: 5,
                max: 20
            },
            pickupFrom: {
                valid: undefined,
                focus: false,
                min: 5,
                max: 10
            },
            pickupTo: {
                valid: undefined,
                focus: false,
                min: 5,
                max: 10
            },
            pickupDatetime: {
                valid: true,
                date: new Date()
            },
            vehicleType: {
                valid: true,
                value: ''
            },
            description: {
                valid: undefined,
                focus: false,
                min: 5,
                max: 300
            },
            sent: false,
            error: false
        };
        this.onChange = this.onChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.onVehicleChange = this.onVehicleChange.bind(this);
        this.clearFields = this.clearFields.bind(this);
    }

    handleBlur(event){
        const field = event.target.name;
        const value = event.target.value;
        this.setState({
            [field]: {
                valid: this.handleValidate(field, value),
                focus: false,
                min: this.state[field].min,
                max: this.state[field].max,
                value: this.state[field].value, 
                date: this.state[field].date
            }
        });
    }

    handleFocus(event){
        const field = event.target.name;
        this.setState({
            [field]: {
                focus: true,
                valid: this.state[field].valid,
                min: this.state[field].min,
                max: this.state[field].max
            }
        });
    }

    handleChange(date) {
        this.setState({
            pickupDatetime: {
                date: date,
                valid: true
            }
        });
    }

    handleValidate(field, value){
        let valid;
        if(field === 'email'){
            valid = ValidationService.email(value);
        }else if(field === 'contactNo'){
            valid = ValidationService.validateNumber(value);
        }else if(field === 'pickupFrom' || field === 'pickupTo'){
            valid = ValidationService.validatePostcode(value);
        }else{
            valid = ValidationService.string(value, this.state[field].min, this.state[field].max);
        }
        return valid;
    }

    handleValidateAllField(data){
        let fieldsValid = true;
        Object.keys(this.state).forEach((item) => {
            if(item !== 'sent' && item !== 'error'){
                const value = data.get(item);
                const valid = this.state[item].valid;
                if(!valid || valid === false){
                    fieldsValid = false;
                }
                this.handleBlur({
                    target: {
                        name: item,
                        value: value
                    }
                });
            }
        });
        return fieldsValid;
    }

    clearFields(){
        Object.keys(this.state).forEach((item) => {
            if(item !== 'vehicleType' && item !== 'sent' && item !== 'error' && item !== 'pickupDatetime'){
                this.setState({
                    [item]: {
                        valid: undefined,
                        focus: false,
                        min: this.state[item].min,
                        max: this.state[item].max,
                        date: this.state[item].date,
                        value: ''
                    }
                });
            }
        });
    }


    handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        const valid =  this.handleValidateAllField(data);
        this.setState({error: false});
        if(valid){
            BookService.book(data)
            .then((data) => {
                this.setState({error: false});
                this.setState({sent: true});
                this.clearFields();
            })
            .catch((error) => {
                this.setState({error: true});
                document.body.scrollTop = 0; // For Safari
                document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
            });
        }
    }



    handleBack() {
        this.setState({sent: false});
    }

    onVehicleChange(vehicle){
        this.setState({
            vehicleType: {
                value: vehicle[0].title,
                valid: true
            }
        });
    }

    onChange(e){
        let value = e.target.value;
      
        value = value.replace(/[^0-9\-()+.]/ig, '');
      
        this.setState({
            contactNo: {
                valid: this.state.contactNo.valid,
                focus: this.state.contactNo.focus,
                value: value,
                min: this.state.contactNo.min,
                max: this.state.contactNo.max
            }
        });
    }

    render() {
        return (
            <article>
                <section>
                    <div className="container">
                        <div className="display-flex">
                            <div className="col-12 no-padding-left no-padding-right">
                                <div className="col-xl-12 text-align-center">
                                    <h1>Make a Booking</h1>
                                    {this.state.sent === false ? <p>Same day pallet delivery prices start from £35</p> : null }
                                </div>

                                <div className="col-xl-8 row col-12 margin-center no-padding-left no-padding-right">
                                    {this.state.error === true ? <div className="col-12"><TechnicalError/></div> : null}
                                    {this.state.sent === false ? 
                                    <form onSubmit={this.handleSubmit}>
                                        <div className="form-group">
                                            <div className="display-flex">
                                                <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12">
                                                    <label>
                                                        Email Address:<small>*</small>
                                                    </label>
                                                </div>
                                                <div className="col-xl-8 col-lg-8 col-md-8 col-sm-8 col-12">
                                                    <input type="email" 
                                                        className={"form-control " + (this.state.email.valid === false && this.state.email.focus === false  ? "input-error" : null)}  
                                                        id="email"
                                                        name="email" 
                                                        onBlur={this.handleBlur} 
                                                        onFocus={this.handleFocus} 
                                                        placeholder="Email..."
                                                        maxlength={this.state.email.max} />
                                                    {this.state.email.valid === false && this.state.email.focus === false  ? <div className="input-error-text">Please enter valid Email address</div> : null}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="display-flex">
                                                <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12">
                                                    <label>
                                                        Full Name:<small>*</small>
                                                    </label>
                                                </div>
                                                <div className="col-xl-8 col-lg-8 col-md-8 col-sm-8 col-12">
                                                    <input type="text" 
                                                        className={"form-control " + (this.state.fullname.valid === false && this.state.fullname.focus === false  ? "input-error" : null)}  
                                                        id="fullname" 
                                                        name="fullname"
                                                        onBlur={this.handleBlur} 
                                                        onFocus={this.handleFocus}
                                                        minLength={this.state.fullname.min}
                                                        maxlength={this.state.fullname.max} 
                                                        placeholder="Full Name..." />
                                                    {this.state.fullname.valid === false && this.state.fullname.focus === false  ? <div className="input-error-text">Please enter your Full name</div> : null}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="display-flex">
                                                <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12">
                                                    <label>
                                                        Contact Number:<small>*</small>
                                                    </label>
                                                </div>
                                                <div className="col-xl-8 col-lg-8 col-md-8 col-sm-8 col-12">
                                                    <input type="text" 
                                                        onChange={this.onChange}
                                                        className={"form-control " + (this.state.contactNo.valid === false && this.state.contactNo.focus === false  ? "input-error" : null)}  
                                                        id="contactNo"
                                                        name="contactNo" 
                                                        onBlur={this.handleBlur} 
                                                        onFocus={this.handleFocus}
                                                        minLength={this.state.contactNo.min}
                                                        maxlength={this.state.contactNo.max} 
                                                        value={this.state.contactNo.value}
                                                        placeholder="Contact No..." />
                                                    {this.state.contactNo.valid === false && this.state.contactNo.focus === false  ? <div className="input-error-text">Please enter valid Contact Number</div> : null}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="display-flex">
                                                <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12">
                                                    <label>
                                                        Pickup from:<small>*</small>
                                                    </label>
                                                </div>
                                                <div className="col-xl-8 col-lg-8 col-md-8 col-sm-8 col-12">
                                                    <input type="text" 
                                                        className={"form-control text-uppercase " + (this.state.pickupFrom.valid === false && this.state.pickupFrom.focus === false  ? "input-error" : null)}  
                                                        id="pickupFrom" 
                                                        name="pickupFrom"
                                                        onBlur={this.handleBlur} 
                                                        onFocus={this.handleFocus}
                                                        minLength={this.state.pickupFrom.min}
                                                        maxlength={this.state.pickupFrom.max} 
                                                        placeholder="Post Code..." />
                                                    {this.state.pickupFrom.valid === false && this.state.pickupFrom.focus === false  ? <div className="input-error-text">Please enter valid Post Code</div> : null}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="display-flex">
                                                <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12">
                                                    <label>
                                                        Deliver to:<small>*</small>
                                                    </label>
                                                </div>
                                                <div className="col-xl-8 col-lg-8 col-md-8 col-sm-8 col-12">
                                                    <input type="text" 
                                                        className={"form-control text-uppercase " + (this.state.pickupTo.valid === false && this.state.pickupTo.focus === false  ? "input-error" : null)}  
                                                        id="pickupTo" 
                                                        name="pickupTo"
                                                        onBlur={this.handleBlur} 
                                                        onFocus={this.handleFocus}
                                                        minLength={this.state.pickupTo.min}
                                                        maxlength={this.state.pickupTo.max} 
                                                        placeholder="Post Code..." />
                                                    {this.state.pickupTo.valid === false && this.state.pickupTo.focus === false  ? <div className="input-error-text">Please enter valid Post Code</div> : null}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="display-flex">
                                                <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12">
                                                    <label>
                                                        Date & Time:<small>*</small>
                                                    </label>
                                                </div>
                                                <div className="col-xl-8 col-lg-8 col-md-8 col-sm-8 col-12">
                                                    <DatePicker
                                                        selected={this.state.pickupDatetime.date}
                                                        onChange={this.handleChange}
                                                        minDate={subDays(new Date(), 0)}
                                                        maxDate={addYears(new Date(), 2)}
                                                        showTimeSelect
                                                        timeFormat="HH:mm"
                                                        timeIntervals={30}
                                                        dateFormat="MMMM d, yyyy h:mm aa"
                                                        timeCaption="time"
                                                    />
                                                    <input type="hidden"
                                                        id="pickupDatetime"
                                                        name="pickupDatetime"
                                                        value={moment(this.state.pickupDatetime.date).format('YYYY-MM-DDTHH:mm')}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="display-flex">
                                                <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12">
                                                    <label>
                                                        Vehicle Type:<small>*</small>
                                                    </label>
                                                </div>
                                                <div className="col-xl-8 col-lg-8 col-md-8 col-sm-8 col-12">
                                                    <VehicleType onVehicleChange={this.onVehicleChange}/>
                                                </div>
                                            </div>
                                            <input type="hidden"
                                                id="vehicleType"
                                                name="vehicleType"
                                                value={this.state.vehicleType.value}/>
                                        </div>
                                        <div className="form-group">
                                            <div className="display-flex">
                                                <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12">
                                                    <label>
                                                        Description:
                                                    </label>
                                                </div>
                                                <div className="col-xl-8 col-lg-8 col-md-8 col-sm-8 col-12">
                                                    <textarea id="description" 
                                                              name="description"
                                                              className={"form-control " + (this.state.description.valid === false && this.state.description.focus === false  ? "input-error" : null)}  
                                                              onBlur={this.handleBlur} 
                                                              onFocus={this.handleFocus}
                                                              minLength={this.state.description.min}
                                                              maxlength={this.state.description.max} 
                                                              placeholder="Parcels, Pallets, Fragile goods"></textarea>
                                                              
                                                    {this.state.description.valid === false && this.state.description.focus === false  ? 
                                                    <div className="input-error-text">
                                                        Your Description character length minimum {this.state.description.min} and maximum {this.state.description.max}
                                                    </div> : null}
                                                </div>
                                            </div>
                                            <input type="hidden"
                                                id="vehicleType"
                                                name="vehicleType"
                                                value={this.state.vehicleType.value}/>
                                        </div>
                                        <div className="form-group">
                                            <div className="display-flex">
                                                <div className="col-12">
                                                    <button className="blue">Submit</button>
                                                </div>
                                            </div>
                                        </div>
                                    </form> : null }
                                    {this.state.sent === true ?
                                    <div className="col-xl-12 col-12 margin-center text-align-center sent">
                                        <img src={sent} alt="Sent"/>
                                        <h2>Thank you, you have booked for the {this.state.vehicleType.value}. You will recieve an Email 
                                        confirmation shortly, we will get back to you.</h2>
                                        <button className="blue" onClick={this.handleBack}>Back to Booking</button>
                                    </div> : null }
                                </div> 
                            </div>
                        </div>
                    </div>
                </section>
            </article>
        );
    }
}

export default BookingForm;
