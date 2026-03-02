package com.education.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * CrawlerService — 启动 Python 智能体爬虫进程
 *
 * 主爬虫：crawl_agent.py（DeepSeek Function Calling 智能体）
 * 备用爬虫：crawl_exam_news.py（静态+LLM降级）
 *
 * 支持 @Scheduled 定时调用（CrawlerScheduler）和 /trigger-crawl 手动触发
 */
@Slf4j
@Service
public class CrawlerService {

    @Value("${crawler.script-path:crawler/crawl_agent.py}")
    private String scriptPath;

    @Value("${crawler.llm-key:}")
    private String llmKey;

    /**
     * 异步执行爬虫（供 /trigger-crawl 接口调用，立即返回）
     */
    @Async
    public void runCrawlerAsync() {
        runCrawler();
    }

    /**
     * 同步执行爬虫（供 @Scheduled 定时任务调用）
     */
    public void runCrawler() {
        log.info("=== CrawlerService: 启动智能体爬虫 ===");
        try {
            Path script = Paths.get(scriptPath).toAbsolutePath();
            log.info("爬虫脚本: {}", script);

            ProcessBuilder pb;
            if (llmKey != null && !llmKey.isBlank()) {
                pb = new ProcessBuilder(
                    "python", script.toString(),
                    "--llm-key", llmKey
                );
            } else {
                pb = new ProcessBuilder("python", script.toString());
            }

            pb.redirectErrorStream(true);
            pb.environment().put("PYTHONIOENCODING", "utf-8");

            // 工作目录设为项目根（爬虫脚本中 API_URL 指向 localhost:8080）
            Path projectRoot = script.getParent().getParent();
            pb.directory(projectRoot.toFile());

            Process process = pb.start();
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream(), "UTF-8"))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    log.info("[爬虫输出] {}", line);
                }
            }

            int exitCode = process.waitFor();
            log.info("=== 爬虫退出 (exit={}) ===", exitCode);

        } catch (Exception e) {
            log.error("CrawlerService: 启动失败 — {}", e.getMessage(), e);
        }
    }
}
