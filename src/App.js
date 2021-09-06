import './App.css';
import React from 'react';
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import { useMatomo } from '@datapunt/matomo-tracker-react'

const getTreeItemsFromData = treeItems => {
	if (treeItems) {
  return treeItems.map(treeItemData => {
    let children = undefined;
    if (treeItemData.successors && treeItemData.successors.length > 0) {
      children = getTreeItemsFromData(treeItemData.successors);
    }
    return (
      <TreeItem
        key={treeItemData.id}
        nodeId={treeItemData.id}
        label={treeItemData.item}
        children={children}		
      />
    );
  });
	}
};
const DataTreeView = ({ treeItems }) => {
  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {getTreeItemsFromData(treeItems)}
    </TreeView>
  );
};

function reducer(state, action) {
	console.log(`reducer: action.type = ${action.type}`);
  switch (action.type) {
	  case 'setSkills': 
		let newState = {...state, skills: action.skills };
		return newState;
    default:
      throw new Error();
  }
}

export default function App() {
	
	const initialState = {skills: []};
	const [state, dispatch] = React.useReducer(reducer, initialState);
	const { trackPageView, trackEvent } = useMatomo();
	trackPageView({
	  documentTitle: `App component with Material UI Treeview: `, // optional
	  //href: `http://localhost:3000`, // optional
	  href: `https://material-ui-treeview-elze.vercel.app`, // optional	  	  
	});	
  
	React.useEffect(() => {    
		async function getSkills() {
			const response = await fetch('https://sc2019.skillclusters.com/sc/structskills');
			const skillsFromServer = await response.json();
			if (response.status !== 200) {
				trackEvent({ category: `https://sc2019.skillclusters.com/sc/structskills retrieval error`, action: skillsFromServer.message });
				throw Error(skillsFromServer.message);
			}
			console.log(`getSkills`);
			trackPageView({
			  documentTitle: `App component with Material UI Treeview: skills loaded `, // optional
			  href: `http://localhost:3000`, // optional
			  //href: `https://zeit-buttons-serverless-elze.vercel.app/primarySkill/${primaryTermDecoded}?sort=${sortParam}`, // optional	  
			});	 				
			dispatch({type: 'setSkills', skills: skillsFromServer})
		}
		console.log(`useEffect is running`);

		getSkills();
		return () => {
			console.log('useEffect return');
		};

	}, [trackPageView, trackEvent]);	
	
  return (
    <div className="App">
      <br />	
      <DataTreeView treeItems={state.skills} />
    </div>
  );
}
