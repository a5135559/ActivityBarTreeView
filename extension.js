const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    // Register a command to open the view
	new ViewProvider();
    context.subscriptions.push(
        vscode.commands.registerCommand('extension.showYourView', () => {
            vscode.commands.executeCommand('workbench.view.extension.activity-id');
        })
    );
}

class ViewProvider{
	constructor() {
        // Create a new webview panel
        this.panel = vscode.window.createWebviewPanel(
            'yourView',
            'Your View',
            vscode.ViewColumn.One,
            {}
        );

        // Set the webview's content with buttons
        this.panel.webview.html = `
            <button id="button1">Button 1</button>
            <button id="button2">Button 2</button>
			<script>
			document.getElementById('button1').addEventListener('click', () => {
				vscode.postMessage({ command: 'button1Clicked' });
			});
			
			document.getElementById('button2').addEventListener('click', () => {
				vscode.postMessage({ command: 'button2Clicked' });
			});
			</script>
        `;

        // Handle button clicks
        this.panel.webview.onDidReceiveMessage(message => {
            if (message.command === 'button1Clicked') {
                // Handle button 1 click
                vscode.window.showInformationMessage('Button 1 clicked!');
            } else if (message.command === 'button2Clicked') {
                // Handle button 2 click
                vscode.window.showInformationMessage('Button 2 clicked!');
            }
        });

        // Set up button click handlers
        this.panel.webview.onDidChangeViewState(() => {
            const { active } = this.panel.webview;
            if (active) {
                this.panel.webview.postMessage({ command: 'setButtonHandlers' });
            }
        });
    }
}

module.exports = {
    activate
};