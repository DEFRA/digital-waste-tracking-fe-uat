import fs from 'fs'
import path from 'path'

/**
 * Generate a detailed HTML report from axe-core accessibility JSON results
 * @param {string} jsonFilePath - Path to the JSON file
 * @param {string} outputFilePath - Path where HTML file should be saved (optional)
 * @returns {string} HTML content
 */
export function generateAccessibilityHTMLReport(
  jsonContent,
  outputFilePath = null
) {
  let data
  try {
    data = JSON.parse(jsonContent)
  } catch (error) {
    throw new Error(`Invalid JSON file: ${error.message}`)
  }

  // Extract sections with defaults
  const header = {
    testEngine: data.testEngine || { name: 'Unknown', version: 'Unknown' },
    testRunner: data.testRunner || { name: 'Unknown' },
    testEnvironment: data.testEnvironment || {
      userAgent: 'Unknown',
      windowWidth: 0,
      windowHeight: 0,
      orientationAngle: 0,
      orientationType: 'unknown'
    },
    timestamp: data.timestamp || new Date().toISOString(),
    url: data.url || 'Unknown URL',
    toolOptions: data.toolOptions || {}
  }

  const inapplicable = data.inapplicable || []
  const passes = data.passes || []
  const incomplete = data.incomplete || []
  const violations = data.violations || []

  // Generate HTML
  const html = generateHTML(
    header,
    inapplicable,
    passes,
    incomplete,
    violations
  )

  // Write to file if output path is provided
  if (outputFilePath) {
    // Ensure output directory exists
    const outputDir = path.dirname(outputFilePath)
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }
    fs.writeFileSync(outputFilePath, html, 'utf8')
    // console.log(`✅ HTML report generated: ${outputFilePath}`)
  }

  return html
}

/**
 * Generate HTML content from accessibility data
 */
function generateHTML(header, inapplicable, passes, incomplete, violations) {
  const timestamp = new Date(header.timestamp).toLocaleString()
  const violationsCount = violations.length
  const passesCount = passes.length
  const inapplicableCount = inapplicable.length
  const incompleteCount = incomplete.length

  // Calculate impact severity counts
  const impactCounts = calculateImpactCounts(violations)

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accessibility Test Report - ${header.url}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
            padding: 20px;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            overflow: hidden;
        }

        /* Header Styles */
        .header {
            background: linear-gradient(135deg, #1d70b8 0%, #0f4c75 100%);
            color: white;
            padding: 30px;
        }

        .header h1 {
            font-size: 2rem;
            margin-bottom: 10px;
        }

        .header-meta {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
            margin-top: 20px;
            font-size: 0.9rem;
        }

        .meta-item {
            background: rgba(255, 255, 255, 0.1);
            padding: 10px;
            border-radius: 4px;
        }

        .meta-label {
            font-weight: bold;
            opacity: 0.9;
        }

        .meta-value {
            margin-top: 5px;
            word-break: break-all;
        }

        /* Summary Cards */
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 30px;
            background: #f8f9fa;
        }

        .summary-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            text-align: center;
        }

        .summary-card.violations {
            border-left: 4px solid #d4351c;
        }

        .summary-card.passes {
            border-left: 4px solid #00703c;
        }

        .summary-card.inapplicable {
            border-left: 4px solid #6c757d;
        }

        .summary-card.incomplete {
            border-left: 4px solid #ffc107;
        }

        .summary-number {
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .summary-label {
            font-size: 0.9rem;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .summary-card.violations .summary-number {
            color: #d4351c;
        }

        .summary-card.passes .summary-number {
            color: #00703c;
        }

        .summary-card.inapplicable .summary-number {
            color: #6c757d;
        }

        .summary-card.incomplete .summary-number {
            color: #ffc107;
        }

        /* Impact Badges */
        .impact-badges {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            margin-top: 10px;
        }

        .impact-badge {
            padding: 5px 12px;
            border-radius: 12px;
            font-size: 0.85rem;
            font-weight: 600;
        }

        .impact-critical {
            background: #d4351c;
            color: white;
        }

        .impact-serious {
            background: #f47738;
            color: white;
        }

        .impact-moderate {
            background: #ffc107;
            color: #333;
        }

        .impact-minor {
            background: #6c757d;
            color: white;
        }

        /* Section Styles */
        .section {
            padding: 30px;
            border-top: 1px solid #e0e0e0;
        }

        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e0e0e0;
        }

        .section-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: #1d70b8;
        }

        .section-count {
            background: #1d70b8;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 600;
        }

        /* Rule Card Styles */
        .rule-card {
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            transition: box-shadow 0.2s;
        }

        .rule-card:hover {
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .rule-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 15px;
            flex-wrap: wrap;
            gap: 10px;
        }

        .rule-id {
            font-family: 'Courier New', monospace;
            font-size: 1.1rem;
            font-weight: 600;
            color: #1d70b8;
        }

        .rule-impact {
            padding: 5px 12px;
            border-radius: 4px;
            font-size: 0.85rem;
            font-weight: 600;
            text-transform: capitalize;
        }

        .rule-description {
            margin: 10px 0;
            font-size: 1rem;
            line-height: 1.6;
        }

        .rule-help {
            margin: 10px 0;
            padding: 10px;
            background: #f8f9fa;
            border-left: 3px solid #1d70b8;
            border-radius: 4px;
        }

        .rule-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin: 10px 0;
        }

        .tag {
            background: #e9ecef;
            color: #495057;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 0.8rem;
        }

        .tag.wcag {
            background: #d1ecf1;
            color: #0c5460;
        }

        .tag.best-practice {
            background: #fff3cd;
            color: #856404;
        }

        .rule-link {
            display: inline-block;
            margin-top: 10px;
            color: #1d70b8;
            text-decoration: none;
            font-size: 0.9rem;
        }

        .rule-link:hover {
            text-decoration: underline;
        }

        /* Node Styles */
        .nodes-container {
            margin-top: 20px;
        }

        .node {
            background: #f8f9fa;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            padding: 15px;
            margin-bottom: 15px;
        }

        .node-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            flex-wrap: wrap;
            gap: 10px;
        }

        .node-selector {
            font-family: 'Courier New', monospace;
            background: #e9ecef;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 0.85rem;
            color: #495057;
        }

        .node-html {
            background: #282c34;
            color: #abb2bf;
            padding: 15px;
            border-radius: 4px;
            overflow-x: auto;
            font-family: 'Courier New', monospace;
            font-size: 0.85rem;
            margin: 10px 0;
        }

        .node-html code {
            white-space: pre-wrap;
            word-break: break-all;
        }

        .failure-summary {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 12px;
            margin: 10px 0;
            border-radius: 4px;
            font-size: 0.9rem;
            white-space: pre-wrap;
        }

        .check-results {
            margin-top: 10px;
        }

        .check-type {
            margin: 10px 0;
        }

        .check-type-title {
            font-weight: 600;
            margin-bottom: 5px;
            font-size: 0.9rem;
            text-transform: uppercase;
            color: #666;
        }

        .check-item {
            padding: 8px;
            margin: 5px 0;
            border-radius: 4px;
            font-size: 0.85rem;
        }

        .check-item.any {
            background: #fff3cd;
            border-left: 3px solid #ffc107;
        }

        .check-item.all {
            background: #d1ecf1;
            border-left: 3px solid #17a2b8;
        }

        .check-item.none {
            background: #f8d7da;
            border-left: 3px solid #dc3545;
        }

        .check-message {
            font-weight: 500;
            margin-bottom: 3px;
        }

        .check-id {
            font-family: 'Courier New', monospace;
            color: #666;
            font-size: 0.8rem;
        }

        /* Empty State */
        .empty-state {
            text-align: center;
            padding: 40px;
            color: #6c757d;
        }

        .empty-state-icon {
            font-size: 3rem;
            margin-bottom: 10px;
        }

        /* Collapsible Sections */
        .collapsible {
            cursor: pointer;
            user-select: none;
        }

        .collapsible::before {
            content: '▼';
            display: inline-block;
            margin-right: 8px;
            transition: transform 0.2s;
        }

        .collapsible.collapsed::before {
            transform: rotate(-90deg);
        }

        .collapsible-content {
            max-height: 1000px;
            overflow: hidden;
            transition: max-height 0.3s ease-out;
        }

        .collapsible-content.collapsed {
            max-height: 0;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .header h1 {
                font-size: 1.5rem;
            }

            .summary {
                grid-template-columns: 1fr;
            }

            .rule-header {
                flex-direction: column;
            }
        }

        /* Print Styles */
        @media print {
            body {
                background: white;
                padding: 0;
            }

            .container {
                box-shadow: none;
            }

            .summary {
                page-break-inside: avoid;
            }

            .rule-card {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header Section -->
        <div class="header">
            <h1>♿ Accessibility Test Report</h1>
            <p style="opacity: 0.9; margin-top: 5px;">Generated from axe-core accessibility testing</p>
            
            <div class="header-meta">
                <div class="meta-item">
                    <div class="meta-label">Test Engine</div>
                    <div class="meta-value">${header.testEngine.name} v${header.testEngine.version}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Test Runner</div>
                    <div class="meta-value">${header.testRunner.name}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Test Date</div>
                    <div class="meta-value">${timestamp}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">URL</div>
                    <div class="meta-value">${header.url}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">User Agent</div>
                    <div class="meta-value">${header.testEnvironment.userAgent}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Viewport</div>
                    <div class="meta-value">${header.testEnvironment.windowWidth} × ${header.testEnvironment.windowHeight}</div>
                </div>
            </div>
        </div>

        <!-- Summary Section -->
        <div class="summary">
            <div class="summary-card violations">
                <div class="summary-number">${violationsCount}</div>
                <div class="summary-label">Violations</div>
                ${
                  impactCounts.total > 0
                    ? `
                <div class="impact-badges">
                    ${impactCounts.critical > 0 ? `<span class="impact-badge impact-critical">Critical: ${impactCounts.critical}</span>` : ''}
                    ${impactCounts.serious > 0 ? `<span class="impact-badge impact-serious">Serious: ${impactCounts.serious}</span>` : ''}
                    ${impactCounts.moderate > 0 ? `<span class="impact-badge impact-moderate">Moderate: ${impactCounts.moderate}</span>` : ''}
                    ${impactCounts.minor > 0 ? `<span class="impact-badge impact-minor">Minor: ${impactCounts.minor}</span>` : ''}
                </div>
                `
                    : ''
                }
            </div>
            <div class="summary-card passes">
                <div class="summary-number">${passesCount}</div>
                <div class="summary-label">Passes</div>
            </div>
            <div class="summary-card inapplicable">
                <div class="summary-number">${inapplicableCount}</div>
                <div class="summary-label">Inapplicable</div>
            </div>
            <div class="summary-card incomplete">
                <div class="summary-number">${incompleteCount}</div>
                <div class="summary-label">Incomplete</div>
            </div>
        </div>

        <!-- Violations Section -->
        <div class="section">
            <div class="section-header">
                <h2 class="section-title">Violations</h2>
                <span class="section-count">${violationsCount}</span>
            </div>
            ${violationsCount > 0 ? renderRules(violations, 'violation') : '<div class="empty-state"><div class="empty-state-icon">✅</div><p>No violations found!</p></div>'}
        </div>

        <!-- Incomplete Section -->
        ${
          incompleteCount > 0
            ? `
        <div class="section">
            <div class="section-header">
                <h2 class="section-title">Incomplete</h2>
                <span class="section-count">${incompleteCount}</span>
            </div>
            ${renderRules(incomplete, 'incomplete')}
        </div>
        `
            : ''
        }

        <!-- Passes Section -->
        <div class="section">
            <div class="section-header">
                <h2 class="section-title">Passes</h2>
                <span class="section-count">${passesCount}</span>
            </div>
            ${passesCount > 0 ? renderRules(passes, 'pass') : '<div class="empty-state"><div class="empty-state-icon">ℹ️</div><p>No passing rules to display</p></div>'}
        </div>

        <!-- Inapplicable Section -->
        <div class="section">
            <div class="section-header">
                <h2 class="section-title">Inapplicable</h2>
                <span class="section-count">${inapplicableCount}</span>
            </div>
            ${inapplicableCount > 0 ? renderRules(inapplicable, 'inapplicable') : '<div class="empty-state"><div class="empty-state-icon">ℹ️</div><p>No inapplicable rules</p></div>'}
        </div>
    </div>

    <script>
        // Add collapsible functionality
        document.querySelectorAll('.collapsible').forEach(button => {
            button.addEventListener('click', function() {
                const content = this.nextElementSibling;
                this.classList.toggle('collapsed');
                content.classList.toggle('collapsed');
            });
        });
    </script>
</body>
</html>`
}

/**
 * Calculate impact counts from violations
 */
function calculateImpactCounts(violations) {
  const counts = {
    critical: 0,
    serious: 0,
    moderate: 0,
    minor: 0,
    total: violations.length
  }

  violations.forEach((violation) => {
    const impact = violation.impact
    if (impact === 'critical') counts.critical++
    else if (impact === 'serious') counts.serious++
    else if (impact === 'moderate') counts.moderate++
    else if (impact === 'minor') counts.minor++
  })

  return counts
}

/**
 * Render rules array
 */
function renderRules(rules, type) {
  if (!rules || rules.length === 0) {
    return '<div class="empty-state"><p>No items in this category</p></div>'
  }

  return rules.map((rule) => renderRule(rule, type)).join('')
}

/**
 * Render a single rule
 */
function renderRule(rule, type) {
  const impactClass = rule.impact ? `impact-${rule.impact}` : ''
  const impactBadge = rule.impact
    ? `<span class="rule-impact ${impactClass}">${rule.impact}</span>`
    : ''

  return `
    <div class="rule-card">
        <div class="rule-header">
            <div>
                <div class="rule-id">${rule.id}</div>
                ${impactBadge}
            </div>
        </div>
        
        <div class="rule-description">
            <strong>${rule.description}</strong>
        </div>
        
        ${
          rule.help
            ? `
        <div class="rule-help">
            <strong>Help:</strong> ${rule.help}
        </div>
        `
            : ''
        }
        
        ${
          rule.tags && rule.tags.length > 0
            ? `
        <div class="rule-tags">
            ${rule.tags
              .map((tag) => {
                const tagClass = tag.includes('wcag')
                  ? 'wcag'
                  : tag.includes('best-practice')
                    ? 'best-practice'
                    : ''
                return `<span class="tag ${tagClass}">${tag}</span>`
              })
              .join('')}
        </div>
        `
            : ''
        }
        
        ${
          rule.helpUrl
            ? `
        <a href="${rule.helpUrl}" target="_blank" class="rule-link">
            📖 View rule documentation →
        </a>
        `
            : ''
        }
        
        ${
          rule.nodes && rule.nodes.length > 0
            ? `
        <div class="nodes-container">
            <h3 style="margin-top: 20px; margin-bottom: 10px; font-size: 1.1rem;">Affected Elements (${rule.nodes.length})</h3>
            ${rule.nodes.map((node, index) => renderNode(node, index, type)).join('')}
        </div>
        `
            : ''
        }
    </div>
  `
}

/**
 * Render a node (affected element)
 */
function renderNode(node, index, type) {
  const target = node.target ? node.target.join(' → ') : 'N/A'
  const html = node.html || 'N/A'

  return `
    <div class="node">
        <div class="node-header">
            <span class="node-selector">Element ${index + 1}: ${target}</span>
            ${node.impact ? `<span class="rule-impact impact-${node.impact}">${node.impact}</span>` : ''}
        </div>
        
        ${
          html !== 'N/A'
            ? `
        <div class="node-html">
            <code>${escapeHtml(html)}</code>
        </div>
        `
            : ''
        }
        
        ${
          node.failureSummary && type === 'violation'
            ? `
        <div class="failure-summary">
            <strong>Failure Summary:</strong><br>
            ${escapeHtml(node.failureSummary)}
        </div>
        `
            : ''
        }
        
        ${
          (node.any && node.any.length > 0) ||
          (node.all && node.all.length > 0) ||
          (node.none && node.none.length > 0)
            ? `
        <div class="check-results">
            ${
              node.any && node.any.length > 0
                ? `
            <div class="check-type">
                <div class="check-type-title">Any (${node.any.length})</div>
                ${node.any.map((check) => renderCheck(check, 'any')).join('')}
            </div>
            `
                : ''
            }
            
            ${
              node.all && node.all.length > 0
                ? `
            <div class="check-type">
                <div class="check-type-title">All (${node.all.length})</div>
                ${node.all.map((check) => renderCheck(check, 'all')).join('')}
            </div>
            `
                : ''
            }
            
            ${
              node.none && node.none.length > 0
                ? `
            <div class="check-type">
                <div class="check-type-title">None (${node.none.length})</div>
                ${node.none.map((check) => renderCheck(check, 'none')).join('')}
            </div>
            `
                : ''
            }
        </div>
        `
            : ''
        }
    </div>
  `
}

/**
 * Render a check result
 */
function renderCheck(check, type) {
  return `
    <div class="check-item ${type}">
        <div class="check-message">${escapeHtml(check.message || 'No message')}</div>
        <div class="check-id">ID: ${check.id}</div>
        ${check.data ? `<div style="margin-top: 5px; font-size: 0.8rem; color: #666;">Data: ${JSON.stringify(check.data)}</div>` : ''}
    </div>
  `
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  if (!text) return ''
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return String(text).replace(/[&<>"']/g, (m) => map[m])
}

// // CLI usage - check if this file is being run directly
// // Simple check: if there are command line arguments, assume CLI usage
// if (process.argv.length > 2) {
//   const args = process.argv.slice(2)
//   if (args.length === 0) {
//     console.error('Usage: node generate-accessibility-html-report.js <json-file> [output-file]')
//     console.error('Example: node generate-accessibility-html-report.js reports/result.json reports/report.html')
//     process.exit(1)
//   }

//   const jsonFile = args[0]
//   const outputFile = args[1] || jsonFile.replace(/\.json$/i, '.html')

//   try {
//     generateAccessibilityHTMLReport(jsonFile, outputFile)
//   } catch (error) {
//     console.error('❌ Error generating report:', error.message)
//     process.exit(1)
//   }
// }
