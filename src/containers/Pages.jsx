import { connectedApi } from '../api';
import { getConnection } from '../selectors';
import { connect } from 'react-redux';
import { logout, expandStructure } from '../reducers/app';
import { push } from 'react-router-redux';
import React, { Component } from 'react';
import { Spinner } from '@blueprintjs/core';
import SplitterLayout from 'Service/SplitterLayout.jsx';
import { Tree } from '@blueprintjs/core';

function mapStateToProps(state) {
    return {
        connection: getConnection(state),
        fetching: state.login.fetching,
        structure: state.app.structure
    };
}

function mapDispatchToProps(disaptch) {
    return {
        onLogout: () => {
            disaptch(logout());
            disaptch(push('/login'));
        },
        onExpand: (id, expand) =>
            disaptch(
                expandStructure(id.split(',').map(x => parseInt(x)), expand)
            )
    };
}

@connect(
    mapStateToProps,
    mapDispatchToProps
)
export default class Pages extends Component {
    componentDidMount() {
        connectedApi().getDatabaseStructure() |> console.log;
    }

    render() {
        const { connection, fetching, structure } = this.props;
        return (
            <SplitterLayout>
                <Tree
                    contents={structure}
                    onNodeCollapse={this.handleNodeCollapse}
                    onNodeExpand={this.handleNodeExpand}
                    onNodeClick={this.handleNodeClick}
                />
                <div>
                    <h2>PAGES</h2>
                    {fetching && <Spinner />}
                    <p>{connection |> JSON.stringify}</p>
                </div>
            </SplitterLayout>
        );
    }

    handleNodeCollapse = node => this.props.onExpand(node.id, false);

    handleNodeExpand = node => this.props.onExpand(node.id, true);

    handleNodeClick = node =>
        node.childNodes.length &&
        this.props.onExpand(node.id, !node.isExpanded);
}