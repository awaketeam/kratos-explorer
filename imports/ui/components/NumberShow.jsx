import React,{ Component } from 'react';

const show_gras = (num_str) => {
  let token_type = num_str.split(' ');
  num_str = token_type[0];
  token_type = token_type.length > 1 ? token_type[1] : '';

  let e_arr = (num_str + '').split('e');
  if (e_arr.length < 2) {
    return num_str + ' ' + token_type;
  }
  return <span className="ft_1222"> {e_arr[0]} x 10<sup>{ e_arr[1] }</sup> <small> {token_type} </small></span>
}

export default class NumberShow extends React.Component {

  constructor(props){
    super(props);
  }

  render () {
    return show_gras(this.props.num_str);
  }

}