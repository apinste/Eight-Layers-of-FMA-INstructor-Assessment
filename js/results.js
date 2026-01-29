// Results Calculation and Display

class ResultsManager {
    constructor(scores) {
        this.scores = scores;
        this.strengths = [];
        this.criticalDevelopment = [];
        this.moderateDevelopment = [];
        this.categorizeScores();
    }

    categorizeScores() {
        // Core layers: Technical, Teaching, Maturity (foundational to instruction quality)
        // Supporting layers: Identity, Curriculum, Community, Alignment (enable effective delivery)
        // Emergent layer: Leadership (recognized when others are strong)
        const coreLayers = [1, 2, 3];
        const supportingLayers = [4, 5, 6, 7];
        const emergentLayer = 8;
        
        const coreThreshold = 4.2;
        const supportingThreshold = 4.0;
        const emergentThreshold = 4.0;
        
        Object.entries(this.scores).forEach(([layerId, data]) => {
            const id = parseInt(layerId);
            let threshold;
            let isCritical = false;
            
            if (coreLayers.includes(id)) {
                threshold = coreThreshold;
                isCritical = true;
            } else if (supportingLayers.includes(id)) {
                threshold = supportingThreshold;
                isCritical = false;
            } else {
                threshold = emergentThreshold;
                isCritical = false;
            }
            
            if (data.score >= threshold) {
                this.strengths.push({ layerId: id, critical: isCritical, ...data });
            } else {
                if (isCritical) {
                    this.criticalDevelopment.push({ layerId: id, critical: true, ...data });
                } else {
                    this.moderateDevelopment.push({ layerId: id, critical: false, ...data });
                }
            }
        });
        
        // Sort by priority
        this.criticalDevelopment.sort((a, b) => a.score - b.score);
        this.moderateDevelopment.sort((a, b) => a.score - b.score);
    }

    displayResults() {
        this.renderChart();
        this.addChartExplanation();
        this.renderOverallAssessment();
        this.renderStrengths();
        this.renderDevelopmentAreas();
        this.renderActionSteps();
    }

    renderChart() {
        const ctx = document.getElementById('results-chart').getContext('2d');
        
        const coreLayers = [1, 2, 3];
        const supportingLayers = [4, 5, 6, 7];
        const emergentLayer = 8;
        
        const labels = Object.values(this.scores).map(s => s.name);
        const allScores = Object.values(this.scores).map(s => s.score);
        
        const coreData = allScores.map((score, idx) => coreLayers.includes(idx + 1) ? score : null);
        const supportingData = allScores.map((score, idx) => supportingLayers.includes(idx + 1) ? score : null);
        const emergentData = allScores.map((score, idx) => (idx + 1) === emergentLayer ? score : null);
        
        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Core Layers (Technical, Teaching, Maturity)',
                        data: coreData,
                        backgroundColor: 'rgba(139, 0, 0, 0.3)',
                        borderColor: 'rgba(139, 0, 0, 1)',
                        borderWidth: 3,
                        pointBackgroundColor: 'rgba(139, 0, 0, 1)',
                        pointBorderColor: '#fff',
                        pointRadius: 6,
                        pointHoverRadius: 8
                    },
                    {
                        label: 'Supporting Layers (Identity, Curriculum, Community, Alignment)',
                        data: supportingData,
                        backgroundColor: 'rgba(255, 152, 0, 0.2)',
                        borderColor: 'rgba(255, 152, 0, 1)',
                        borderWidth: 2,
                        pointBackgroundColor: 'rgba(255, 152, 0, 1)',
                        pointBorderColor: '#fff',
                        pointRadius: 5,
                        pointHoverRadius: 7
                    },
                    {
                        label: 'Emergent (Leadership)',
                        data: emergentData,
                        backgroundColor: 'rgba(46, 125, 50, 0.2)',
                        borderColor: 'rgba(46, 125, 50, 1)',
                        borderWidth: 2,
                        pointBackgroundColor: 'rgba(46, 125, 50, 1)',
                        pointBorderColor: '#fff',
                        pointRadius: 5,
                        pointHoverRadius: 7
                    }
                ]
            },
            options: {
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 5,
                        ticks: {
                            stepSize: 1,
                            font: {
                                size: 11
                            }
                        },
                        pointLabels: {
                            font: {
                                size: 11
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: {
                                size: 11
                            },
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                if (context.parsed.r !== null) {
                                    return context.dataset.label.split('(')[0].trim() + ': ' + context.parsed.r.toFixed(1) + '/5.0';
                                }
                                return '';
                            }
                        }
                    }
                }
            }
        });
    }

    addChartExplanation() {
        const resultsContainer = document.querySelector('.results-summary');
        const explanationDiv = document.createElement('div');
        explanationDiv.className = 'chart-explanation';
        explanationDiv.innerHTML = `
            <p><strong>Core Layers</strong> are foundational to instructional quality and safety. Weaknesses here impact everything else.</p>
            <p><strong>Supporting Layers</strong> enable effective program delivery and cultural transmission.</p>
            <p><strong>Leadership</strong> emerges when all other layers are strong. It's recognized, not performed.</p>
        `;
        resultsContainer.appendChild(explanationDiv);
    }

    renderOverallAssessment() {
        const overallAverage = Object.values(this.scores).reduce((sum, layer) => sum + layer.score, 0) / Object.keys(this.scores).length;
        
        const coreScores = [1, 2, 3].map(id => this.scores[id].score);
        const coreAverage = coreScores.reduce((sum, score) => sum + score, 0) / coreScores.length;
        
        let message = '';
        let messageClass = '';
        
        if (coreAverage >= 4.2 && overallAverage >= 4.0) {
            messageClass = 'excellence-message';
            message = `
                <h2>Strong Instructional Foundation</h2>
                <p><strong>Overall: ${overallAverage.toFixed(1)}/5.0</strong> | <strong>Core Layers: ${coreAverage.toFixed(1)}/5.0</strong></p>
                <p>You demonstrate competence across foundational layers. Continue refining your practice through deliberate training and cultural study.</p>
            `;
        } else if (coreAverage >= 3.5) {
            messageClass = 'progress-message';
            message = `
                <h2>Solid Foundation, Clear Path Forward</h2>
                <p><strong>Overall: ${overallAverage.toFixed(1)}/5.0</strong> | <strong>Core Layers: ${coreAverage.toFixed(1)}/5.0</strong></p>
                <p>Foundational competence is established. Focus on development priorities below to strengthen instruction quality.</p>
            `;
        } else {
            messageClass = 'journey-message';
            message = `
                <h2>Development Priorities Identified</h2>
                <p><strong>Overall: ${overallAverage.toFixed(1)}/5.0</strong> | <strong>Core Layers: ${coreAverage.toFixed(1)}/5.0</strong></p>
                <p>Clear priorities identified. Focus on core layers first - they are foundational to everything else.</p>
            `;
        }
        
        const resultsContainer = document.querySelector('.results-summary');
        const messageDiv = document.createElement('div');
        messageDiv.className = `assessment-message ${messageClass}`;
        messageDiv.innerHTML = message;
        
        resultsContainer.parentNode.insertBefore(messageDiv, resultsContainer.nextSibling);
    }

    renderStrengths() {
        const container = document.getElementById('strengths-list');
        container.innerHTML = '';
        
        if (this.strengths.length === 0) {
            container.innerHTML = '<p>All layers show opportunity for deliberate practice and refinement.</p>';
            return;
        }
        
        this.strengths.forEach(strength => {
            const div = document.createElement('div');
            div.className = 'layer-result strength';
            div.innerHTML = `
                <h3>Layer ${strength.layerId}: ${strength.name}</h3>
                <p class="layer-score">Score: ${strength.score.toFixed(1)}/5.0</p>
            `;
            container.appendChild(div);
        });
    }

    renderDevelopmentAreas() {
        const container = document.getElementById('development-list');
        container.innerHTML = '';
        
        const allDevelopment = [...this.criticalDevelopment, ...this.moderateDevelopment];
        
        if (allDevelopment.length === 0) {
            document.getElementById('development-section').style.display = 'none';
            return;
        }
        
        allDevelopment.forEach((area, index) => {
            const isSafetyCritical = [1, 5].includes(area.layerId) && area.score < 4.0;
            const div = document.createElement('div');
            div.className = `layer-result development ${area.critical ? 'critical' : ''}`;
            
            let priority = '';
            if (index === 0) priority = ' <span class="priority-badge">Priority 1</span>';
            else if (index === 1) priority = ' <span class="priority-badge">Priority 2</span>';
            else if (index === 2) priority = ' <span class="priority-badge">Priority 3</span>';
            
            let safetyWarning = '';
            if (isSafetyCritical) {
                safetyWarning = '<p class="safety-warning">⚠️ <strong>Safety-Critical</strong> - Impacts training safety and instructional credibility</p>';
            }
            
            div.innerHTML = `
                <h3>Layer ${area.layerId}: ${area.name}${priority}</h3>
                <p class="layer-score">Score: ${area.score.toFixed(1)}/5.0${area.critical ? ' (Core Layer)' : ''}</p>
                ${safetyWarning}
            `;
            container.appendChild(div);
        });
    }

    renderActionSteps() {
        const container = document.getElementById('action-steps-container');
        container.innerHTML = '';
        
        const allDevelopment = [...this.criticalDevelopment, ...this.moderateDevelopment];
        const priorities = allDevelopment.slice(0, 3);
        
        priorities.forEach((area, index) => {
            const actionPlan = this.getActionPlan(area.layerId);
            
            const section = document.createElement('div');
            section.className = 'priority-section';
            section.innerHTML = `
                <h3>Priority ${index + 1}: ${area.name} <span class="score-badge">${area.score.toFixed(1)}/5.0</span></h3>
                ${actionPlan.context}
                <div class="action-timeline">
                    <div class="timeline-section">
                        <h4>📅 Short-Term (1-3 months)</h4>
                        <ul>
                            ${actionPlan.shortTerm.map(step => `<li>${step}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="timeline-section">
                        <h4>📅 Long-Term (6+ months)</h4>
                        <ul>
                            ${actionPlan.longTerm.map(step => `<li>${step}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                ${actionPlan.resources ? `
                    <div class="resources-section">
                        <h4>📚 Resources</h4>
                        <ul>
                            ${actionPlan.resources.map(resource => `<li>${resource}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            `;
            container.appendChild(section);
        });
        
        if (priorities.length === 0) {
            container.innerHTML = '<p>Continue refining all layers. Instructional mastery is lifelong deliberate practice.</p>';
        }
    }

    getActionPlan(layerId) {
        const actionPlans = {
            1: {
                context: '<p>Technical competence is foundational to credible instruction and training safety.</p>',
                shortTerm: [
                    'Record solo and partner drills weekly - review mechanics and timing',
                    'Focus on one variable per session (footwork, weapon alignment, striking)',
                    'Practice slow-work to refine structure and precision',
                    'Train regularly with your mentor for corrections'
                ],
                longTerm: [
                    'Apply principles across all weapon platforms (stick, knife, sword, empty hand)',
                    'Integrate advanced drills, sparring, and flow exercises safely',
                    'Refine movement efficiency and tactical logic continuously',
                    'Study biomechanics and kinetic chain principles'
                ],
                resources: [
                    'Film yourself weekly and keep training journal',
                    'Study biomechanics and kinetics',
                    'Review senior practitioners\' recordings',
                    'Cross-train to observe power generation in other combat arts'
                ]
            },
            2: {
                context: '<p>Teaching is a distinct skill. Effective instruction requires diagnosing errors, communicating principles, and creating safe learning environments.</p>',
                shortTerm: [
                    'Teach single concepts in short lessons - focus on WHY, not just HOW',
                    'Give concise corrections based on structure and timing',
                    'Document case notes: error → correction → result → next step',
                    'Use explain → demo → drill → correct → refine cycle'
                ],
                longTerm: [
                    'Develop multiple ways to explain concepts (visual, kinesthetic, analytical)',
                    'Create psychologically safe environments for learning',
                    'Mentor junior instructors in teaching principles',
                    'Adapt lessons to different learning styles'
                ],
                resources: [
                    'Keep teaching journal with case notes',
                    'Record 5-minute micro-lessons and review clarity',
                    'Observe skilled instructors',
                    'Read: "The Inner Game of Tennis" by Timothy Gallwey'
                ]
            },
            3: {
                context: '<p>Maturity and judgment create environments where students train safely and learn effectively.</p>',
                shortTerm: [
                    'Reflect after each session: what worked / what needs improvement',
                    'Accept feedback without defensiveness - apply immediately',
                    'Practice emotional regulation during challenging interactions',
                    'Reject fear-based methods - use science-backed protocols'
                ],
                longTerm: [
                    'Model humility and openness - acknowledge mistakes',
                    'Make science-based, safe training decisions',
                    'Deepen patience, foresight, and situational judgment',
                    'Seek mentorship on professional conduct'
                ],
                resources: [
                    'Keep reflective practice journal',
                    'Study modern sports science and conditioning',
                    'Consider working with therapist or coach',
                    'Read: "Ego is the Enemy" by Ryan Holiday'
                ]
            },
            4: {
                context: '<p>Program identity provides clarity on what you offer beyond technique. Cultural alignment is essential to transmitting FMA as a complete martial art.</p>',
                shortTerm: [
                    'Write teaching philosophy - emphasize respect, safety, principles',
                    'Clarify who your training serves (and who it does NOT)',
                    'Articulate what FMA offers: self-defense, tactics, culture, martial art',
                    'Pre-screen new students for alignment'
                ],
                longTerm: [
                    'Deepen Philippine culture and history understanding',
                    'Study Filipino values: kapwa, bayanihan, utang na loob, pakikisama, hiya',
                    'Continuously refine program mission',
                    'Align curriculum with cultural and ethical principles'
                ],
                resources: [
                    'Write and post teaching philosophy',
                    'Study Philippine history and cultural studies',
                    'Attend Filipino cultural events or FMA retreats',
                    'Create intake questionnaire for alignment'
                ]
            },
            5: {
                context: '<p>Clear curriculum and reliable operations enable effective principle transmission and training safety.</p>',
                shortTerm: [
                    'Document progression from fundamentals to advanced across weapons',
                    'Establish written safety protocols for sparring and contact drills',
                    'Maintain reliable class scheduling and attendance tracking',
                    'Create student-facing roadmap showing progression'
                ],
                longTerm: [
                    'Refine curriculum pacing through reflection and mentorship',
                    'Update operational systems for efficiency',
                    'Integrate milestone assessments for principle understanding',
                    'Work with mentor to refine delivery'
                ],
                resources: [
                    'FMA curriculum design templates',
                    'Safety protocol checklists',
                    'Student progress tracking spreadsheets',
                    'Communication tools: WhatsApp, Discord, Google Sheets'
                ]
            },
            6: {
                context: '<p>Community builds through intentional stewardship. Lineage culture is transmitted through modeling, not just talking.</p>',
                shortTerm: [
                    'Model respect, humility, culturally-informed behavior',
                    'Encourage peer support and mentorship',
                    'Facilitate community-building practices (group drills, challenges)',
                    'Prioritize social skills and respectful communication'
                ],
                longTerm: [
                    'Develop strong, values-based community',
                    'Integrate cultural lessons and lineage history regularly',
                    'Mentor senior students to lead initiatives',
                    'Attend cultural events and retreats'
                ],
                resources: [
                    'Community-building activity ideas',
                    'Senior student mentorship templates',
                    'Lineage history resources',
                    'Filipino cultural organizations and FMA events'
                ]
            },
            7: {
                context: '<p>Understanding student goals helps you serve effectively. Address misalignment with compassion and clarity.</p>',
                shortTerm: [
                    'Conduct goal-setting conversations with each student',
                    'Clarify expectations and commitment levels',
                    'Encourage students to track progress and reflect',
                    'Address misalignment with compassion - no shame or guilt'
                ],
                longTerm: [
                    'Cultivate self-directed, responsible practitioners',
                    'Let go gracefully when needed',
                    'Promote values-driven participation: curiosity, respect, stewardship',
                    'Train with mentor on student psychology'
                ],
                resources: [
                    'Student goal-setting worksheet',
                    'New student intake questions',
                    'Commitment assessment framework',
                    'Scripts for compassionate misalignment conversations'
                ]
            },
            8: {
                context: '<p>Leadership is recognized when you embody competence, care, and consistency across all layers.</p>',
                shortTerm: [
                    'Lead by example - practice, demonstrate, explain consistently',
                    'Serve through guidance and feedback, not authority or dominance',
                    'Continue mentorship with senior instructors',
                    'Model humility and continuous learning'
                ],
                longTerm: [
                    'Embody stewardship and competence across all layers',
                    'Mentor others in reflective practice',
                    'Recognize leadership as product of sustained excellence',
                    'Strengthen all foundational layers continuously'
                ],
                resources: [
                    'Re-take this assessment every 6 months',
                    'Study servant leadership in FMA lineages',
                    'Seek ongoing mentorship',
                    'Contribute to FMA community through teaching or organizing'
                ]
            }
        };
        
        return actionPlans[layerId] || {
            context: '<p>Focus on building this foundational layer.</p>',
            shortTerm: ['Revisit questions in this section'],
            longTerm: ['Develop through consistent practice'],
            resources: []
        };
    }
}
