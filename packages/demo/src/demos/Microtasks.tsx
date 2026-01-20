import { useState } from "react";
import { useAccount } from "wagmi";
import { PayButton, TrustBadge, useEthosScore } from "@ethos/reputation-gate";
import TrustGate from "../components/TrustGate";
import toast from "react-hot-toast";

import { TREASURY_ADDRESS } from "../config/constants";

export function MicrotasksDemo() {
  const { address } = useAccount();
  const { score } = useEthosScore(address);
  const [hasPosted, setHasPosted] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskReward, setTaskReward] = useState("");
  const [taskDeadline, setTaskDeadline] = useState("24");
  const ethAmount = 0.002;

  return (
    <div className="glass-card rounded-3xl p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm font-semibold text-purple-700">TASK</span>
        <div>
          <h2 className="text-2xl font-bold">Post Microtask</h2>
          <p className="text-gray-600">Quick jobs for the community</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 mb-6">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <span className="text-xs font-semibold text-purple-700">TRENDING</span>
          <span>Popular Microtasks:</span>
        </h3>
        <div className="space-y-3">
          <TaskExample title="Translate whitepaper to Spanish" reward="$50 USDC" poster="ELITE" time="2h ago" />
          <TaskExample title="Design 3 social media graphics" reward="$75 USDC" poster="TRUSTED" time="5h ago" />
          <TaskExample title="Write 500-word blog post about DeFi" reward="$40 USDC" poster="ELITE" time="1d ago" />
        </div>
      </div>

      {address && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Your Reputation:</span>
            <TrustBadge score={score} showScore />
          </div>
        </div>
      )}

      <div className="glass-card rounded-2xl p-4 mb-6">
        <div className="flex items-start gap-2">
          <span className="text-xs font-semibold text-yellow-800">NOTE</span>
          <div className="flex-1">
            <h4 className="font-semibold text-yellow-900 mb-2">Quality Control</h4>
            <p className="text-sm text-yellow-800 mb-2">
              Only EMERGING tier users (1000+ score) can post tasks. This ensures:
            </p>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li className="flex items-center gap-2">
                <span>OK</span>
                <span>No scam tasks or fake payments</span>
              </li>
              <li className="flex items-center gap-2">
                <span>OK</span>
                <span>Verified posters with proven track record</span>
              </li>
              <li className="flex items-center gap-2">
                <span>OK</span>
                <span>Higher completion rates and quality</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/40 pt-6 mb-6">
        {!hasPosted && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Task Title *</label>
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="e.g., Design logo for DeFi project"
                className="w-full px-4 py-2 glass-pill border border-white/40 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Task Description *</label>
              <textarea
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="Describe the task in detail. Include requirements, deliverables, and any specific guidelines..."
                rows={4}
                className="w-full px-4 py-2 glass-pill border border-white/40 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reward Amount (USDC) *</label>
                <input
                  type="number"
                  value={taskReward}
                  onChange={(e) => setTaskReward(e.target.value)}
                  placeholder="50"
                  className="w-full px-4 py-2 glass-pill border border-white/40 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
                <select 
                  value={taskDeadline}
                  onChange={(e) => setTaskDeadline(e.target.value)}
                  className="w-full px-4 py-2 glass-pill border border-white/40 rounded-xl"
                >
                  <option value="24">24 hours</option>
                  <option value="72">3 days</option>
                  <option value="168">7 days</option>
                  <option value="336">14 days</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills (Optional)</label>
              <div className="flex flex-wrap gap-2">
                {"Design,Writing,Coding,Translation,Video Editing,Research".split(",").map((skill) => (
                  <button
                    key={skill}
                    className="px-3 py-1 glass-pill border border-white/40 rounded-full text-sm transition-colors hover:border-purple-300/60"
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="glass-card rounded-2xl p-4 mb-6">
        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
          <span className="text-xs font-semibold text-blue-700">FEE</span>
          <span>Posting Fee: $5 USDC or {ethAmount} ETH</span>
        </h4>
        <p className="text-xs text-gray-700">
          A small fee prevents spam and ensures serious task posters. Fee goes toward platform development and community
          rewards.
        </p>
      </div>

      <div className="border-t border-white/40 pt-6">
        {hasPosted ? (
          <div className="glass-card rounded-2xl p-6">
            <div className="text-center mb-4">
              <div className="text-2xl mb-2">OK</div>
              <h4 className="font-bold text-green-900 mb-2">Task Posted!</h4>
              <p className="text-green-700 text-sm mb-4">
                Your task is now live. Workers can start applying immediately.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-4 mb-4">
              <div className="font-semibold mb-2">{taskTitle || "Your Task"}</div>
              <div className="text-sm text-gray-600 mb-3">
                {taskDescription.substring(0, 100)}
                {taskDescription.length > 100 && "..."}
              </div>
              <div className="grid grid-cols-3 gap-4 text-xs border-t pt-3">
                <div>
                  <span className="text-gray-600">Reward:</span>
                  <div className="font-semibold text-purple-600">${taskReward || "0"}</div>
                </div>
                <div>
                  <span className="text-gray-600">Deadline:</span>
                  <div className="font-semibold">{taskDeadline}h</div>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <div className="font-semibold text-green-600">LIVE</div>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-4 mb-4 text-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Task ID:</span>
                <span className="font-mono font-semibold">#MT-{Math.floor(Math.random() * 10000)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Applications:</span>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Views:</span>
                <span className="font-semibold">{Math.floor(Math.random() * 50) + 10}</span>
              </div>
            </div>

            <div className="text-center">
              <a href="#" onClick={(e) => e.preventDefault()} className="text-blue-600 hover:underline text-sm font-medium">
                View Task Dashboard
              </a>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <h3 className="font-semibold mb-3">Requirements</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className={score >= 1000 ? "text-green-500" : "text-red-500"}>
                    {score >= 1000 ? "OK" : "NO"}
                  </span>
                  <span>
                    EMERGING tier (1000+ score)
                    {score < 1000 && score > 0 && <span className="text-gray-500"> - You have {score}</span>}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className={taskTitle && taskDescription && taskReward ? "text-green-500" : "text-gray-400"}>
                    {taskTitle && taskDescription && taskReward ? "OK" : "WAIT"}
                  </span>
                  <span>Complete task details</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">REQ</span>
                  <span>$5 USDC or {ethAmount} ETH posting fee</span>
                </li>
              </ul>
            </div>

            <TrustGate minScore={1000} userScore={score}>
              <PayButton
                amount={5}
                amounts={{ USDC: 5, ETH: ethAmount }}
                tokens={["USDC", "ETH"]}
                recipient={TREASURY_ADDRESS}
                label={(selectedToken, amount) => `Post Task - ${amount} ${selectedToken} Fee`}
                onSuccess={() => {
                  setHasPosted(true);
                  toast.success("Task posted successfully!");
                }}
                onError={(error) => {
                  toast.error(`Posting failed: ${error.message}`);
                }}
                disabled={!taskTitle.trim() || !taskDescription.trim() || !taskReward}
                className="w-full"
              />

              <p className="text-xs text-gray-500 text-center mt-3">
                Task reward held in escrow until completion
              </p>
            </TrustGate>
          </>
        )}
      </div>

      <div className="mt-6 glass-pill rounded-xl p-4">
        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500">TIPS</span>
          <span>Tips for Success:</span>
        </h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>- Be specific about deliverables and requirements</li>
          <li>- Set realistic deadlines and fair compensation</li>
          <li>- Respond quickly to questions from workers</li>
          <li>- Leave reviews to help workers build reputation</li>
        </ul>
      </div>
    </div>
  );
}

function TaskExample({
  title,
  reward,
  poster,
  time
}: {
  title: string;
  reward: string;
  poster: string;
  time: string;
}) {
  return (
    <div className="glass-card rounded-2xl p-3 border border-white/40 hover:border-purple-500 transition-colors cursor-pointer">
      <div className="flex justify-between items-start mb-1">
        <h4 className="font-medium text-sm flex-1">{title}</h4>
        <span className="text-purple-600 font-bold text-sm ml-2">{reward}</span>
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span>Posted by {poster}</span>
        <span>-</span>
        <span>{time}</span>
      </div>
    </div>
  );
}
