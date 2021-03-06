import React from 'react';
import './App.css';
import ContentEditable from 'react-contenteditable';
// import { trackPromise } from 'react-promise-tracker';
import ReactPlayer from 'react-player'

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showVideo: false,
            script: "",
            // txt: [],
            // timestamps: [],
            vid: null,
            editMode: false,
        }

        this.myRef = [];
        // this.handleSeek = this.handleSeek.bind(this.player);
    }



    handleOnClick = (event) => {
      //.current is verification that your element has rendered
      console.log(event.target.className);
      if (event.target.className !== "undefined" && event.target.className in this.myRef){
        this.myRef[event.target.className].scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'start' });
        this.myRef[event.target.className].style.backgroundColor = 'LightPink'
        setTimeout(() => {
        this.myRef[event.target.className].style.backgroundColor = ''
      }, 1000);
      }
    }

    findVideo(url) {
        var component = <div className="row edit-video-container">
                            <ReactPlayer ref={player => {this.player = player}}
                                        url = {this.props.url}
                                        onSeek = {this.handleSeek}
                                        // playing
                                        controls
                                        width='100%'
                                        // height='100%'
                                        // onSeek={(e)=>console.log('onSeek', e)}
                                        />
                        </div>
        return component
    }

    handleSeek = p => {
        console.log('handleSeek', p)
        this.player.setState({ seeking: true })
        // this.player.seekTo(parseFloat(e.target.value))
        // if(this.player.current !== null) {
        //     console.log('seeking to', p)
        this.player.seekTo(p)
        // }
        setTimeout(()=>this.player.setState({ seeking: false }), 800)
    }

    navigateTo(ts) {
        console.log(ts, this.player)
        if (!this.state.showVideo) {
            this.setState({showVideo: true})
        }
        if (this.player){
            console.log('HERE', this.player)
            this.player.props.onSeek(ts)
        }

    }


    render() {
        var component = this.findVideo(this.props.url)

        return (
            <div className="container-fluid">
                {(this.state.showVideo) ?

                <div className="row">
                    <div className="col-12 video-col">
                        {component}
                    </div>
                </div>
                :
                <div/>
                }

                <div className="row edit-video-info-container">
                    <div className="col-10">
                        <h5 className="subtitle" class="mt-5">{this.props.title}</h5>


                    </div>
                    <div className="col-2" style={{textAlign: "right"}}>
                        <button type="button" className="btn btn-danger btnEdit btn-block"
                        onClick={() => this.props.setPage("main")}>Hide Original Text</button>

                        <button type="button" className="btn btn-warning btnEdit btn-block"
                        onClick={() => this.setState({showVideo: !this.state.showVideo})}>{(this.state.showVideo) ? "Hide Video" : "Show Video"}</button>

                    </div>
                </div>



                <div className="row">
                    <div className="col-6 text-col">
                            <div className="container">
                                <div className="edit-summary-header">
                                    <div style={{display: "inline-block"}}>
                                        <h4>Original Text</h4>
                                    </div>
                                </div>
                                <div className="summary min-vh-100">
                                    <ContentEditable
                                    innerRef={this.ContentEditable}
                                    html = {' '}
                                    disabled={true}
                                    onChange={this.props.editFullText}/>
                                  {this.props.fullText.map( (x, i) => (
                                        <span style={{cursor:'pointer'}}
                                          className={this.props.timestamps[i]}
                                          ref={(ref) => { this.myRef[this.props.timestamps[i]] = ref }}
                                          key = {this.props.timestamps[i]}
                                          onClick = {() => {this.navigateTo(this.props.timestamps[i])}}
                                        >{x  + " "}</span>
                                      ))}

                                </div>
                            </div>
                        </div>

                        <div className="col-6 text-col">
                            <div className="container h-100">
                              <div className="edit-summary-header">
                                  <div class= 'my-auto' style={{display: "inline-block"}}>
                                      <h4>Summary</h4>
                                  </div>
                                  <div style={{display: "inline-block", float: "right"}}>
                                      <button type="button" className="btn btn-warning"
                                      onClick={() => this.setState({editMode: !this.state.editMode})}>{(this.state.editMode) ? "Save" : "Edit"}</button>
                                  </div>
                              </div>
                                <div className="summary min-vh-100">
                                  {(this.state.editMode) ?
                                    <ContentEditable
                                    innerRef={this.ContentEditable}
                                    html={this.props.sentSpan}
                                    // html={this.props.summary}
                                    disabled={false}
                                    onChange={this.props.editSummary}/>
                                    :
                                    <ContentEditable
                                    innerRef={(this.props.sentSpan === undefined) ? "Summarizing..." : this.props.sentSpan}
                                    html={this.props.sentSpan}
                                    disabled={true}
                                    onClick={this.handleOnClick}
                                    />
                                  }

                                </div>
                            </div>
                        </div>
                </div>
            </div>
        );
    }
}

export default Edit;
