import './App.css';
import React from 'react';
import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import { useMatomo } from '@datapunt/matomo-tracker-react'

const useStyles = makeStyles({
	label: {
		backgroundColor: "#FFEFD5",
		borderRadius: "10px",
		padding: "5px 5px 5px 5px"
	},
	content: {
		padding: "10px 10px 10px 10px",
		backgroundColor: "white"
	},
	expanded: {
		backgroundColor: "white"
	},
	selected: { 
		backgroundColor: "#adc9e6"
	}
});

const getTreeItemsFromData = treeItems => {
	if (treeItems) {		
	  return treeItems.map(treeItemData => {
		let children = undefined;
		if (treeItemData.successors && treeItemData.successors.length > 0) {
		  children = getTreeItemsFromData(treeItemData.successors);
		}		  		
		const classes = useStyles();
		return (
		  <TreeItem
			  classes={{
				  root: 'tree-item-root',
				label: classes.label, // 'tree-item-label', 
				content: classes.content, // 'tree-item-content',
				expanded: classes.expanded, // 'tree-item-expanded',
				selected: 'tree-item-selected'
			  }}		  
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

export default function App() {	
	const [skills, setSkills] = useState(null);
	const { trackPageView, trackEvent } = useMatomo();

	useEffect(() => {    
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
			  //href: `http://localhost:3000`, // optional
			  href: `https://material-ui-treeview-elze.vercel.app`,
			});	 				
			setSkills(skillsFromServer);
		}
		console.log(`useEffect is running`);

		getSkills();
		return () => {
			console.log('useEffect return');
		};

	}, [trackPageView, trackEvent]);	
	
  return (
    <div className="App">
	<Container maxWidth="sm"><h2>SkillClusters with Material UI</h2></Container>
	<p>This application is created with React.js and Material UI TreeView component. The source code is here: <a href="https://github.com/elze/sc-material-ui">https://github.com/elze/sc-material-ui</a>.</p>
      <br />	
      <DataTreeView treeItems={skills} />
    </div>
  );
}
