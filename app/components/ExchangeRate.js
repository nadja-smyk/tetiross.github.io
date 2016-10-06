var React = require('react');

var ExchangeRateContainer = React.createClass({
  getInitialState: function () {
    return {
      rates: []
    }
  },

  loadRatesFromServer: function() {
    $.ajax({
      url: 'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5',
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({rates: data});
      }.bind(this)
    });
  },

  componentDidMount: function () {
    this.loadRatesFromServer();
    setInterval(this.loadRatesFromServer, 5000)
  },

  render: function () {
    var rate_boxes = this.state.rates.map(function (rate, i) {
      return <RateBox
        currencyFrom={rate.ccy}
        currencyTo={rate.base_ccy}
        buy={rate.buy}
        sale={rate.sale}
        key={i}
      />
    });

    return (
      <div className='col-md-8 col-md-offset-2'>
        <div className='react_item_container'>
          <h4> Exchange rate app </h4>
          <hr />
          {rate_boxes}
          <ExchangeRateCalculator rates={this.state.rates} />
        </div>
      </div>
    );
  }
})

function RateBox (props) {
  return (
    <div className='rate-box'
         style={props.currencyFrom === 'RUR' ? {display: 'none'} : {}} >

      <h4> {props.currencyFrom} &#45; {props.currencyTo} </h4>
      <p> Buy: {props.buy} </p>
      <p> Sale: {props.sale} </p>
    </div>
  );
};

var ExchangeRateCalculator = React.createClass({
  getInitialState: function () {
    return {
      number: null,
      exchanged_number: null
    }
  },

  handleNumberChange: function (e) {
    newNumber = e.target.value;

    if (newNumber != '') {
      exchanged_number = (parseInt(newNumber, 10) * this.props.rates[0].buy)
                           .toFixed(2)
    } else {
      exchanged_number = ''
    };

    this.setState({
      number: newNumber,
      exchanged_number: exchanged_number
    });
  },

  render: function () {
    return (
      <div>
        <div className='row'>
          <div className='col-xs-3'>
            <input
              type='number'
              min='1'
              max='9999999999'
              className='form-control input-sm'
              id='exchange_input'
              value={this.state.inputNumber}
              onChange={this.handleNumberChange} />
          </div>
        </div>
        <h5> &#61; {this.state.exchanged_number} </h5>
      </div>
    );
  }
});

module.exports = ExchangeRateContainer;