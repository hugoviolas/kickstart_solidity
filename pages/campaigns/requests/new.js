import react from "react";
import { Component } from "react/cjs/react.production.min";
import { Form, Button, Input, Message } from "semantic-ui-react";
import Campaign from "../../../ethereum/campaign"; 
import web3 from "../../../ethereum/web3";
import Layout from "../../../components/Layout";
import { Link, Router } from "../../../routes";

class RequestNew extends Component {

    state = {
        description: '',
        value: '',
        recipient: '',
        errorMessage: '',
        loading: false
    };

    static async getInitialProps(props) {
        const { address } = props.query;
        return { address };
    }

    

    onSubmit = async (event) => {
        event.preventDefault();

        this.setState({loading: true, errorMessage: ''});

        const campaign = Campaign(this.props.address);
        const { description, value, recipient } = this.state;

        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.createRequest(description, web3.utils.toWei(value, "ether"), recipient)
                .send({from: accounts[0]});
            
            Router.pushRoute(`/campaigns/${this.props.address}/requests`);
        } catch (err) {
            this.setState({ errorMessage: err.message });
        };

        this.setState({loading: false});
    }

    render() {
        return (
            <Layout>
                <h3>Create a Request</h3>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field width={10}>
                        <label>Description</label>
                        <Input
                            value={this.state.description}
                            onChange={event => this.setState({description: event.target.value})}
                        >
                        </Input>
                    </Form.Field>

                    <Form.Field width={10}>
                        <label>Value in Ether</label>
                        <Input
                            value={this.state.amount}
                            onChange={event => this.setState({value: event.target.value})}
                        >
                        </Input>
                    </Form.Field>

                    <Form.Field width={10}>
                        <label>Recipient</label>
                        <Input
                            value={this.state.recipient}
                            onChange={event => this.setState({recipient: event.target.value})}
                        >
                        </Input>
                    </Form.Field>

                    <Message error header="Oops !" content={this.state.errorMessage} />
                    <Button loading={this.state.loading} primary>Create !</Button>
                </Form>
            </Layout>
            
        );
    }
}

export default RequestNew;