import * as React from "react";
import { DefaultButton } from "@fluentui/react";
import Header from "./Header";
import HeroList, { HeroListItem } from "./HeroList";
import Progress from "./Progress";
// images references in the manifest
import "../../../assets/icon-16.png";
import "../../../assets/icon-32.png";
import "../../../assets/icon-80.png";
/* global console, Office */

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

export interface AppState {
  listItems: HeroListItem[];
  test: string;
}

export default class App extends React.Component<AppProps, AppState> {
  constructor(props, context) {
    super(props, context);
    this.state = {
      listItems: [],
      test: "test",
    };
  }

  componentDidMount() {
    this.setState({
      listItems: [
        {
          icon: "Ribbon",
          primaryText: "Achieve more with Office integration",
        },
        {
          icon: "Unlock",
          primaryText: "Unlock features and functionality",
        },
        {
          icon: "Design",
          primaryText: "Create and visualize like a pro",
        },
      ],
    });
  }

  click = async () => {
    /**
     * Insert your PowerPoint code here
     */
    console.log("here");
    Office.context.document.getFileAsync(Office.FileType.Pdf, async (result) => {
      if (result.status == Office.AsyncResultStatus.Failed) {
        console.error(result.error.message);
        this.setState({
          test: result.error.message,
        });
        return;
      }
      for await (let index of new Array(result.value.sliceCount).keys()) {
        await new Promise((resolve, reject) => {
          result.value.getSliceAsync(index, async (result) => {
            if (result.status == Office.AsyncResultStatus.Failed) {
              console.error(result.error.message);
              return;
            }
            const array = new Uint8Array(result.value.data);
            const body = btoa(String.fromCharCode.apply(null, array));
            try {
              await fetch("http://localhost:8888/test", {
                method: "POST",
                body,
              });
              resolve(null);
            } catch (e) {
              reject(e);
            }
          });
        });
      }
      result.value.closeAsync();
    });
  };

  render() {
    const { title, isOfficeInitialized } = this.props;

    if (!isOfficeInitialized) {
      return (
        <Progress title={title} logo="assets/logo-filled.png" message="Please sideload your addin to see app body." />
      );
    }

    return (
      <div className="ms-welcome">
        <Header logo="assets/logo-filled.png" title={this.props.title} message="Welcome" />
        <HeroList message="Discover what Office Add-ins can do for you today!" items={this.state.listItems}>
          <p className="ms-font-l">
            Modify the source files, then click <b>Run</b>.
          </p>
          <DefaultButton className="ms-welcome__action" iconProps={{ iconName: "ChevronRight" }} onClick={this.click}>
            Run
          </DefaultButton>
          <p>{this.state.test}</p>
        </HeroList>
      </div>
    );
  }
}
