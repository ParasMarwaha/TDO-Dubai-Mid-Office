import React, { Component } from 'react';

import PageTitle from "../../../layouts/PageTitle";
import CkEditorBlog from './CkEditorBlog';

class CkEditor extends Component {
    render() {
        return (
            <>
                <PageTitle activeMenu="CkEditor" motherMenu="Form" pageContent="CkEditor" />
                <div className="row">
                    <div className="col-xl-12 col-xxl-12">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">CkEditor</h4>
                            </div>
                            <div className="card-body custom-ekeditor">
                               <CkEditorBlog />
                            </div>
                        </div>
                    </div>        
                </div>        
            </>
        );
    }
}

export default CkEditor;